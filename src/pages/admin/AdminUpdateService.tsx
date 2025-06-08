import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, X, Upload, Loader2, ArrowLeft } from "lucide-react";
import { visaTypeService, UpdateVisaTypeData } from "@/lib/api/services/visatype.service";
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
  isActive: z.boolean().default(true),
  coverImage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AdminUpdateService = () => {
  const { id } = useParams();
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
      isActive: true,
      coverImage: "",
    }
  });
  
  const { watch, setValue } = form;
  const requirements = watch("requirements");
  const eligibleCountries = watch("eligibleCountries");
  const coverImage = watch("coverImage");

  const fetchVisaType = useCallback(async (visaTypeId: string) => {
    try {
      const response = await visaTypeService.getVisaTypeById(visaTypeId);
      const visaType = response.data;
      
      form.reset({
        name: visaType.name,
        description: visaType.description || "",
        price: visaType.price.toString(),
        processingTime: visaType.processingTime,
        duration: visaType.duration,
        requirements: visaType.requirements,
        eligibleCountries: visaType.eligibleCountries,
        isActive: visaType.isActive,
        coverImage: visaType.coverImage || "",
      });

      if (visaType.coverImage) {
        setPreviewUrl(visaType.coverImage);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch visa type details",
        variant: "destructive",
      });
    }
  }, [form, toast]);

  useEffect(() => {
    if (id) {
      fetchVisaType(id);
    }
  }, [id, fetchVisaType]);

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
    if (!id) {
      toast({
        title: "Error",
        description: "Visa type ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Form values:', values);

      // Validate required fields
      if (!values.name || !values.description || !values.price || !values.processingTime || !values.duration) {
        console.log('Missing required fields:', {
          name: !values.name,
          description: !values.description,
          price: !values.price,
          processingTime: !values.processingTime,
          duration: !values.duration
        });
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Validate arrays
      if (!values.requirements.length || !values.eligibleCountries.length) {
        console.log('Missing array data:', {
          requirements: values.requirements,
          eligibleCountries: values.eligibleCountries
        });
        toast({
          title: "Error",
          description: "Please add at least one requirement and eligible country",
          variant: "destructive",
        });
        return;
      }

      // Handle image upload if there's a new image
      let coverImageUrl = values.coverImage;
      if (selectedImage) {
        try {
          console.log('Uploading image...');
          coverImageUrl = await uploadToFirebase(selectedImage);
          console.log('Image uploaded successfully:', coverImageUrl);
        } catch (error) {
          console.error('Image upload error:', error);
          toast({
            title: "Error",
            description: "Failed to upload image",
            variant: "destructive",
          });
          return;
        }
      }

      const updateData: UpdateVisaTypeData = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        processingTime: values.processingTime,
        duration: values.duration,
        requirements: values.requirements,
        eligibleCountries: values.eligibleCountries,
        isActive: values.isActive,
        coverImage: coverImageUrl || undefined,
      };

      console.log('Updating visa type:', updateData);
      await visaTypeService.updateVisaType(id, updateData);
      
      toast({
        title: "Success",
        description: "Visa service updated successfully",
      });

      navigate("/dashboard/services");
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update visa service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout 
      title="Edit Visa Service" 
      subtitle="Update visa service details"
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
                Enter the basic details of the visa service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter visa service name" {...field} />
                    </FormControl>
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
                        placeholder="Enter visa service description"
                        {...field}
                      />
                    </FormControl>
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
                          placeholder="Enter price"
                          {...field}
                        />
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
                        <Input
                          placeholder="e.g., 5-7 business days"
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
                        <Input
                          placeholder="e.g., 30 days"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a requirement"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addRequirement();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addRequirement}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((req, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {req}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => removeRequirement(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eligibleCountries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eligible Countries</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a country"
                            value={newCountry}
                            onChange={(e) => setNewCountry(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addCountry();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addCountry}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((country, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {country}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => removeCountry(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input
                            id="cover-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="max-w-xs"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleImageUpload}
                            disabled={!selectedImage || isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload
                              </>
                            )}
                          </Button>
                          {previewUrl && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={clearSelectedImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        )}
                        {previewUrl && (
                          <div className="relative w-96 h-48">
                            <img
                              src={previewUrl}
                              alt="Cover preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Inactive visa types will not be visible to applicants.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <CardFooter className="flex justify-between pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/dashboard/services")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || form.formState.isSubmitting}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Visa Service"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </AdminLayout>
  );
};

export default AdminUpdateService;