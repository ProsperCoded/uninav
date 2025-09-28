"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllFaculties } from "@/api/faculty.api";
import { Faculty } from "@/lib/types/response.type";
import { cn } from "@/lib/utils";

interface FacultySelectProps {
  onDepartmentSelect: (departmentId: string) => void;
  defaultDepartmentId?: string;
}

const DepartmentByFacultySelect: React.FC<FacultySelectProps> = ({
  onDepartmentSelect,
  defaultDepartmentId,
}) => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<{
    id: string;
    name: string;
    facultyName: string;
  } | null>(null);

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        setLoading(true);
        const response = await getAllFaculties();
        if (response?.status === "success") {
          setFaculties(response.data);

          // If we have a default department ID, find and set it
          if (defaultDepartmentId) {
            for (const faculty of response.data) {
              const department = faculty.departments?.find(
                (dept) => dept.id === defaultDepartmentId
              );
              if (department) {
                setSelectedDepartment({
                  id: department.id,
                  name: department.name,
                  facultyName: faculty.name,
                });
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading faculties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFaculties();
  }, [defaultDepartmentId]);

  // Flatten departments for searching
  const departments = faculties.flatMap((faculty) =>
    (faculty.departments || []).map((department) => ({
      id: department.id,
      name: department.name,
      facultyName: faculty.name,
      facultyId: faculty.id,
    }))
  );

  const handleDepartmentSelect = (departmentId: string) => {
    const department = departments.find((dept) => dept.id === departmentId);
    if (department) {
      setSelectedDepartment(department);
      onDepartmentSelect(departmentId);
      setOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-md w-full h-10 animate-pulse"></div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
          disabled={loading}
        >
          {selectedDepartment
            ? `${selectedDepartment.name} (${selectedDepartment.facultyName})`
            : "Select department..."}
          <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full" align="start">
        <Command>
          <CommandInput placeholder="Search departments..." />
          <CommandList>
            <CommandEmpty>No department found.</CommandEmpty>
            {faculties.map((faculty) => (
              <CommandGroup key={faculty.id} heading={faculty.name}>
                {faculty.departments?.map((department) => (
                  <CommandItem
                    key={department.id}
                    value={`${department.name} ${faculty.name}`}
                    onSelect={() => handleDepartmentSelect(department.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDepartment?.id === department.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {department.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DepartmentByFacultySelect;
