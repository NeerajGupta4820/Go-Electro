
import { useEffect, useState } from "react";
import { useAllUsersMutation } from "../../../redux/api/userAPI";
import { ToastContainer, toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";

const Customers = () => {
  const [allUsers, { isLoading, isError, error }] = useAllUsersMutation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await allUsers().unwrap();
        setUsers(result.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users. Please try again.", {
          className: "bg-red-500 text-white p-4 rounded-lg",
          progressClassName: "bg-white",
        });
      }
    };

    fetchUsers();
  }, [allUsers]);

  const handleClosePopup = (e) => {
    if (e.target.classList.contains("user-popup")) {
      setSelectedUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-green-600 text-lg font-medium">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-medium">
        Error: {error?.data?.message || "Failed to fetch users"}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg min-h-screen sm:p-4 xs:p-3">
        <ToastContainer toastClassName="min-w-[300px]" />
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-teal-500 bg-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-700 sm:text-2xl xs:text-xl">
              All Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-green-500 hover:bg-green-500">
                  <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                    Photo
                  </TableHead>
                  <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                    Name
                  </TableHead>
                  <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                    Email
                  </TableHead>
                  <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                    Role
                  </TableHead>
                  <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-blue-100"
                      } hover:bg-blue-200 transition-colors cursor-pointer`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <TableCell className="p-4 sm:p-3 xs:p-2">
                        <Avatar className="h-12 w-12 sm:h-10 sm:w-10 xs:h-9 xs:w-9">
                          <AvatarImage src={user.photo} alt={user.name} />
                          <AvatarFallback>
                            {user.name ? user.name[0].toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="text-teal-600 truncate max-w-[150px] sm:text-sm xs:text-xs" title={user.name}>
                        {user.name.slice(0, 15)}...
                      </TableCell>
                      <TableCell className="text-teal-600 sm:text-sm xs:text-xs">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-teal-600 sm:text-sm xs:text-xs">
                        {user.role}
                      </TableCell>
                      <TableCell className="p-4 sm:p-3 xs:p-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Placeholder for future edit functionality
                                  toast.info("Edit functionality coming soon!", {
                                    className: "bg-blue-500 text-white p-4 rounded-lg",
                                    progressClassName: "bg-white",
                                  });
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition-all hover:scale-105"
                                aria-label="Edit user"
                              >
                                Edit
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit User</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center p-4 text-gray-500 text-sm"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedUser && (
          <div
            className="user-popup fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={handleClosePopup}
          >
            <Card className="relative w-full max-w-md bg-white shadow-xl border-l-4 border-teal-500">
              <Button
                variant="ghost"
                className="absolute top-3 right-3 text-teal-600 hover:text-teal-800 p-1"
                onClick={() => setSelectedUser(null)}
                aria-label="Close user details"
              >
                <X className="h-6 w-6" />
              </Button>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-green-700">
                  {selectedUser.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Avatar className="w-36 h-36 mx-auto">
                  <AvatarImage src={selectedUser.photo} alt={selectedUser.name} />
                  <AvatarFallback>
                    {selectedUser.name ? selectedUser.name[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-teal-600">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-teal-600">
                  <strong>Role:</strong> {selectedUser.role}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
export default Customers;