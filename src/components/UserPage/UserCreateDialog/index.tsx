"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "@/hooks/useAdmin";
import { toast } from "react-toastify";
import { IconLoader2, IconPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserCreateDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: UserCreateDialogProps) => {
  const [formData, setFormData] = useState({
    clerk_id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createUserMutation, isPending } = useCreateUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clerk_id.trim()) {
      newErrors.clerk_id = "Clerk ID is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is not valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createUserMutation(formData, {
      onSuccess: (_response: any) => {
        toast.success("User created successfully!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.message || "There was an error creating the user!");
      },
    });
  };

  const handleClose = () => {
    setFormData({
      clerk_id: "",
      name: "",
      email: "",
      phone: "",
    });
    setErrors({});
    onClose();
  };

  const generateClerkId = () => {
    const prefix = "user_";
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setFormData((prev) => ({ ...prev, clerk_id: prefix + randomString }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] overflow-y-auto bg-white"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-700">Add New User</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clerk_id" className="text-gray-700">
                Clerk ID <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="clerk_id"
                  name="clerk_id"
                  value={formData.clerk_id}
                  onChange={handleChange}
                  placeholder="Enter clerk ID or generate one"
                  className={`${
                    errors.clerk_id ? "border-red-500" : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={generateClerkId}
                  className="whitespace-nowrap"
                >
                  Generate ID
                </Button>
              </div>
              {errors.clerk_id && (
                <p className="text-red-500 text-sm">{errors.clerk_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter user name"
                className={`${
                  errors.name ? "border-red-500" : "border-lightBorderV1"
                } focus:border-mainTextHoverV1`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`${
                  errors.email ? "border-red-500" : "border-lightBorderV1"
                } focus:border-mainTextHoverV1`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`${
                  errors.phone ? "border-red-500" : "border-lightBorderV1"
                } focus:border-mainTextHoverV1`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <IconPlus className="h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
