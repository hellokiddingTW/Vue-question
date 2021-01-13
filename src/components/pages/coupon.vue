<template>
  <div>
    <div class="vld-parent">
      <loading :active.sync="isLoading"></loading>
   </div>
   <h1>sssssssss</h1>
             

    <!-- Modal Delete -->
  </div>
</template>





<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      tempProduct: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false,
        fileDone: false,
      },
      pagination: {},
    };
  },
  methods: {
    getProducts(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        // console.log(response);
        vm.isLoading = false;
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
        // console.log(vm.pagination);
      });
    },

    openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }
      $("#productModal").modal("show");
    },

    updateProduct() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
      const vm = this;
      let httpMethod = `post`;
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
        httpMethod = `put`;
      }
      this.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => {
        if (response.data) {
          alert(response.data.message);
          $("#productModal").modal("hide");
          this.getProducts();
        } else {
          $("#productModal").modal("hide");
          this.getProducts();
          console.log("新增失敗");
        }
      });
    },

    deleteProduct(item) {
      const vm = this;
      this.tempProduct = Object.assign({}, item);
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
      this.$http.delete(api).then((response) => {
        this.getProducts();
      });
    },

    uploadFile() {
    //   console.log(this);
      const uploadedFile = this.$refs.files.files[0];
      const vm = this;
      const formData = new FormData();
      formData.append("file-to-upload", uploadedFile);
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
      vm.status.fileUploading = true;
      this.$http
        .post(api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.success) {
            vm.status.fileUploading = false;
            vm.status.fileDone = true;
            vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl);
          } else {
            console.log(response.data.message)
            this.$bus.$emit("message:push", response.data.message, "danger");
          }
        });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
