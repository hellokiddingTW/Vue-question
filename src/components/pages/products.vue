<template>
  <div>
    <div class="vld-parent">
      <loading :active.sync="isLoading"></loading>
    </div>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="80">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">{{ item.price }}</td>
          <td class="text-right">{{ item.origin_price }}</td>
          <td class="text-center">
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td class="btn-group" role="group" aria-label="Basic example">
            <button
              class="btn btn-outline-primary btn-sm"
              @click="openModal(false, item)"
            >
              編輯
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="deleteProduct(item)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !pagination.has_pre}">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in pagination.total_pages" :key="page" 
        :class="{'active':pagination.current_page === page}"
        ><a class="page-link" href="#"
        @click.prevent="getProducts(page)"
        >{{page}}</a></li>
        <li class="page-item" :class="{'disabled': !pagination.has_next}">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white py-3">
            <h5 class="modal-title" id="exampleModalLabel">建立新的產品</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="imageUrl">輸入圖片網址</label>
                  <input
                    type="text"
                    placeholder="輸入圖片網址"
                    name="imageUrl"
                    class="form-control"
                    id="imageUrl"
                    v-model="tempProduct.imageUrl"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片</label>
                  <i
                    class="fas fa-spinner fa-spin"
                    v-if="status.fileUploading"
                  ></i>
                  <i
                    class="fas fa-check text-success"
                    v-if="status.fileDone"
                  ></i>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="uploadFile"
                  />
                </div>
                <img
                  class="img-fluid"
                  alt=""
                  :src="tempProduct.imageUrl"
                />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="email"
                    class="form-control"
                    id="title"
                    aria-describedby="emailHelp"
                    placeholder="請輸入標題"
                    v-model="tempProduct.title"
                  />
                </div>
                <div class="form-row">
                  <div class="col-sm-6 form-group">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="請輸入分類"
                      name="category"
                      id="category"
                      v-model="tempProduct.category"
                    />
                  </div>
                  <div class="col-sm-6 form-group">
                    <label for="unit">單位</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="請輸入單位"
                      id="unit"
                      name="unit"
                      v-model="tempProduct.unit"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="col-sm-6 form-group">
                    <label for="origin_price">原價</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="請輸入原價"
                      name="origin_price"
                      id="origin_price"
                      v-model="tempProduct.origin_price"
                    />
                  </div>
                  <div class="col-sm-6 form-group">
                    <label for="price">售價</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="請輸入售價"
                      id="price"
                      name="price"
                      v-model="tempProduct.price"
                    />
                  </div>
                </div>
                <hr />
                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    class="form-control"
                    name="description"
                    id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    class="form-control"
                    name="content"
                    id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"
                  ></textarea>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="is_enabled"
                    name="is_enabled"
                    v-model="tempProduct.is_enabled"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-dark"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateProduct"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
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
        this.status.fileDone = false;
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
      // this.tempProduct = Object.assign({}, item);
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${item.id}`;
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
            // vm.tempProduct.imageUrl = response.data.imageUrl
            // console.log(vm.tempProduct)
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
