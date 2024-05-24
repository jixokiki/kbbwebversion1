"use client";
import useAuth from "@/app/hooks/useAuth";
import NavbarAdmin from "@/components/NavbarAdmin";
import { db, auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  onSnapshot,
  deleteDoc, // Add this import
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const User = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && userProfile.role === "user") {
      router.push("/");
    }
  }, [user, userProfile, router]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (userProfile.role !== "admin") {
      console.log("Only admin can add users.");
      return; // Prevent non-admin users from adding users
    }

    const userData = {
      name: name,
      role: role,
      email: email,
      password: password,
      status: "offline",
    };

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      await setDoc(doc(db, "users", res.user.uid), {
        ...userData,
        timeStamp: serverTimestamp(),
      });
      // Provide user feedback after successful addition
      alert("User added successfully!");
      // Clear input fields
      setName("");
      setRole("user");
      setEmail("");
      setPassword(""); // untuk password menyesuaikan kriteria firebase yaitu harus minimal 6 karakter
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again later.");
    }
  };

  // const handleEditUser = async () => {
  //   try {
  //     const currentUser = auth.currentUser;
  //     if (!currentUser) {
  //       alert("User not found. Please log in again.");
  //       return;
  //     }
  //     const newName = prompt("Enter new name:");
  //     const newRole = prompt("Enter new role:");
  //     if (!newName || !newRole) {
  //       alert("Name and role are required.");
  //       return;
  //     }
  //     await setDoc(
  //       doc(db, "users", currentUser.uid),
  //       {
  //         name: newName,
  //         role: newRole,
  //       },
  //       { merge: true }
  //     );
  //     alert("Your information has been updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     alert("Failed to update user. Please try again later.");
  //   }
  // };

  // Memperbarui fungsi handleEditUser

  // Fungsi untuk mengedit pengguna secara keseluruhan
  const handleEditUser2 = async (selectedUser2) => {
    // if (!selectedUser) {
    //   alert("No user selected for editing.");
    //   return;
    // }
    try {
      const newName = prompt("Enter new name:", selectedUser2.name);
      const newRole = prompt("Enter new role:", selectedUser2.role);
      if (!newName || !newRole) {
        alert("Name and role are required.");
        return;
      }
      await setDoc(
        doc(db, "users", selectedUser2.id),
        {
          name: newName,
          role: newRole,
        },
        { merge: true }
      );
      alert("User information updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again later.");
    }
  };

  const handleEditUser = async (selectedUser) => {
    try {
      const newName = prompt("Enter new name:", selectedUser.name);
      const newRole = prompt("Enter new role:", selectedUser.role);
      if (!newName || !newRole) {
        alert("Name and role are required.");
        return;
      }
      await setDoc(
        doc(db, "users", selectedUser.id),
        {
          name: newName,
          role: newRole,
        },
        { merge: true }
      );
      alert("User information updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again later.");
    }
  };

  // State untuk menyimpan pengguna yang dipilih untuk diedit
  const [selectedUser, setSelectedUser] = useState(null);

  // Fungsi untuk mengatur pengguna yang dipilih untuk diedit
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  // Fungsi untuk mengedit pengguna
  const handleEditUserSet = () => {
    if (!selectedUser) {
      alert("No user selected for editing.");
      return;
    }
    // Lakukan logika untuk mengedit pengguna, misalnya mengirim permintaan ke server
    console.log("Editing user:", selectedUser);
    // Atau sesuaikan dengan kebutuhan aplikasi Anda
  };

  // const handleDeleteUser = async (userId) => {
  //   try {
  //     await deleteDoc(doc(db, "users", userId));
  //     alert("User deleted successfully!");
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //     alert("Failed to delete user. Please try again later.");
  //   }
  // };

  const handleDeleteUser = async (userId) => {
    try {
      const confirmation = window.confirm(
        "Apakah Anda yakin ingin menghapus pengguna ini?"
      );
      if (confirmation) {
        await deleteDoc(doc(db, "users", userId));
        alert("User deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again later.");
    }
  };

  return (
    <div className="w-[87%] mx-auto mt-32">
      <NavbarAdmin />

      <div className="flex justify-between items-center gap-3 mb-10">
        <h1 className="text-3xl font-semibold mb-3">User List</h1>
        <input
          type="text"
          placeholder="Search here"
          className="input input-bordered w-full max-w-xs"
        />

        <button
          className="btn bg-teal-600 hover:bg-teal-500 text-white"
          onClick={() => document.getElementById("addUserModal").showModal()}
        >
          Add User
        </button>
        <button
          className="btn bg-green-600 hover:bg-green-500 text-white"
          onClick={() => {
            handleSelectUser(user);
            handleEditUser2();
          }}
        >
          Edit
        </button>

        <button
          className="btn bg-red-600 hover:bg-red-500 text-white"
          onClick={() => handleDeleteUser(user.id)}
        >
          Delete
        </button>

        <dialog id="addUserModal" className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-xl">Add User</h3>
            <form onSubmit={handleAddUser}>
              <div className="py-4">
                <div className="flex flex-col gap-3 mb-3">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Masukkan nama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input input-bordered w-full "
                  />
                </div>
                <div className="flex flex-col gap-3 mb-3">
                  <label htmlFor="role">Role</label>
                  <select
                    name="role"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="select select-bordered w-full"
                  >
                    <option>user</option>
                    <option>admin</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3 mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full "
                    required
                  />
                </div>
                <div className="flex flex-col gap-3 mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full "
                    required
                  />
                </div>
                <button type="submit" className={`w-full btn bg-teal-500`}>
                  Add User
                </button>
              </div>
            </form>
            <div className="modal-action">
              <form method="dialog" className="flex gap-1">
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    document.getElementById("addUserModal").close()
                  }
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div
                    className={`badge ${
                      user.status == "offline" ? "badge-error" : "badge-accent"
                    }`}
                  >
                    {user.status}
                  </div>
                </td>
                <td>
                  <button
                    className="btn bg-green-600 hover:bg-green-500 text-white"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn bg-red-600 hover:bg-red-500 text-white"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal untuk pengeditan pengguna */}
        {selectedUser && (
          <div className="modal">
            <div className="modal-box">
              <h3>Edit User</h3>
              <form onSubmit={handleEditUserSet}>
                {/* Formulir untuk pengeditan */}
                <input
                  type="text"
                  value={selectedUser.name} // Misalnya, menampilkan nama pengguna yang dipilih untuk diedit
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
                {/* Form input lainnya */}
                <button type="submit">Save Changes</button>
              </form>
              {/* Tombol untuk menutup modal */}
              <button onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
