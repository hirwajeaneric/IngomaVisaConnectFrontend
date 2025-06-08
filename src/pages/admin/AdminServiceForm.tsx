import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, X, Upload, Loader2, ArrowLeft } from "lucide-react";
import { visaTypeService } from "@/lib/api/services/visatype.service";
import { storage } from "@/configs/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  processingTime: z.string().min(1, "Processing time is required"),
  duration: z.string().min(1, "Duration is required"),
  requirements: z.array(z.string()).min(1, "At least one requirement is required"),
  eligibleCountries: z.array(z.string()).min(1, "At least one eligible country is required"),
  coverImage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ValidationError {
  field: keyof FormValues | string;
  message: string;
}

const AdminServiceForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newRequirement, setNewRequirement] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      processingTime: "",
      duration: "",
      requirements: [],
      eligibleCountries: [],
      coverImage: "",
    }
  });

  const { watch, setValue } = form;
  const requirements = watch("requirements");
  const eligibleCountries = watch("eligibleCountries");
  const coverImage = watch("coverImage");

  const addRequirement = () => {
    if (newRequirement.trim() !== "") {
      setValue("requirements", [...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = [...requirements];
    updatedRequirements.splice(index, 1);
    setValue("requirements", updatedRequirements);
  };

  const addCountry = () => {
    if (newCountry.trim() !== "") {
      setValue("eligibleCountries", [...eligibleCountries, newCountry.trim()]);
      setNewCountry("");
    }
  };

  const removeCountry = (index: number) => {
    const updatedCountries = [...eligibleCountries];
    updatedCountries.splice(index, 1);
    setValue("eligibleCountries", updatedCountries);
  };

  const uploadToFirebase = async (file: File): Promise<string> => {
    if (!file) throw new Error("No file selected");

    const storageRef = ref(storage, `visa-types/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setValue("coverImage", "");
    const fileInput = document.getElementById('cover-image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadToFirebase(selectedImage);
      setValue("coverImage", imageUrl);
      setPreviewUrl(imageUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      setSelectedImage(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (values: FormValues) => {
    console.log('=== Form Submission Started ===');
    console.log('Raw form values:', values);

    try {
      setLoading(true);
      console.log('=== Starting Form Submission Process ===');

      let coverImageUrl = values.coverImage;
      if (selectedImage) {
        console.log('Starting image upload...');
        coverImageUrl = await uploadToFirebase(selectedImage);
        console.log('Image upload successful:', coverImageUrl);
      }

      const visaTypeData = {
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        processingTime: values.processingTime.trim(),
        duration: values.duration.trim(),
        requirements: values.requirements,
        eligibleCountries: values.eligibleCountries,
        coverImage: coverImageUrl || undefined,
      };

      console.log('Submitting visa type data:', visaTypeData);
      const response = await visaTypeService.createVisaType(visaTypeData);
      console.log('Visa type creation response:', response);

      toast({
        title: "Success",
        description: "Visa service created successfully",
      });

      navigate("/dashboard/services");
    } catch (error) {
      console.error('=== Form Submission Failed ===');
      console.error('Error details:', error);
      toast({
        title: "Error",
        description: error instanceof Error
          ? `Error: ${error.message}`
          : "Failed to create visa service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      form.reset(form.getValues()); // Reset form state
      console.log('=== Form Submission Process Completed ===');
    }
  };

  // Add form state change monitoring
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log(`Form field "${name}" changed:`, value);
      console.log('Current form state:', form.formState);
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  return (
    <AdminLayout
      title="Create Visa Service"
      subtitle="Add a new visa service to the system"
    >
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => navigate("/dashboard/services")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-20">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details about this visa type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visa Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tourist Visa, Business Visa" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name that will be displayed to applicants.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of this visa type"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed explanation of the visa purpose, eligibility criteria, and other important information.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g. 50.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 30 days, 6 months" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="processingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Processing Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5-7 business days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="cover-image-upload"
                              onChange={handleImageSelect}
                              disabled={isUploading}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isUploading}
                              onClick={() => document.getElementById('cover-image-upload')?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Select Image
                            </Button>
                          </div>
                          {selectedImage && (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleImageUpload}
                                disabled={isUploading}
                              >
                                {isUploading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading {uploadProgress}%
                                  </>
                                ) : (
                                  "Upload"
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearSelectedImage}
                                disabled={isUploading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                        {(previewUrl || field.value) && (
                          <div className="relative w-full max-w-xs">
                            <img
                              src={previewUrl || field.value}
                              alt="Cover preview"
                              className="rounded-lg object-cover w-full h-48"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={clearSelectedImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a cover image for this visa type. Recommended size: 1200x800 pixels.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>
                Specify the documents and other requirements for this visa type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2 mb-4">
                <div className="flex-grow">
                  <Label htmlFor="newRequirement">Add Requirement</Label>
                  <Input
                    id="newRequirement"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="e.g. Valid passport with 6 months validity"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addRequirement}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {requirements.length === 0 && (
                <p className="text-sm text-gray-500 italic">No requirements added yet.</p>
              )}

              <div className="space-y-2">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border"
                  >
                    <span className="text-sm">{req}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                      className="text-gray-500 hover:text-red-500 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligible Countries</CardTitle>
              <CardDescription>
                Specify which countries are eligible for this visa type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2 mb-4">
                <div className="flex-grow">
                  <Label htmlFor="newCountry">Add Country</Label>
                  <Input
                    id="newCountry"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="e.g. United States"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addCountry}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {eligibleCountries.length === 0 && (
                <p className="text-sm text-gray-500 italic">No countries added yet.</p>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {eligibleCountries.map((country, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {country}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCountry(index)}
                      className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/services")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || form.formState.isSubmitting}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Visa Service"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </AdminLayout>
  );
};

export default AdminServiceForm;
