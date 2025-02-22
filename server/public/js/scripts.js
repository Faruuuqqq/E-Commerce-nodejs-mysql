// document.addEventListener("DOMContentLoaded", () => {
//   const addProductForm = document.getElementById("addProductForm");
//   const productList = document.getElementById("productList");

//   // Tambah produk
//   addProductForm.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const formData = new FormData(addProductForm);
//       const productData = {
//           name: formData.get("name"),
//           price: formData.get("price"),
//           image: formData.get("image")
//       };

//       try {
//           const response = await fetch("/admin/add-product", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(productData),
//           });

//           if (response.ok) {
//               alert("Product added successfully!");
//               location.reload();
//           } else {
//               alert("Failed to add product.");
//           }
//       } catch (error) {
//           console.error("Error:", error);
//       }
//   });

//   // Hapus produk
//   productList.addEventListener("click", async (e) => {
//       if (e.target.classList.contains("delete-btn")) {
//           const productId = e.target.dataset.id;
//           if (!confirm("Are you sure you want to delete this product?")) return;

//           try {
//               const response = await fetch(`/admin/delete-product/${productId}`, { method: "DELETE" });
//               if (response.ok) {
//                   alert("Product deleted successfully!");
//                   location.reload();
//               } else {
//                   alert("Failed to delete product.");
//               }
//           } catch (error) {
//               console.error("Error:", error);
//           }
//       }
//   });

//   // Edit produk (bisa dikembangkan lebih lanjut)
// });
