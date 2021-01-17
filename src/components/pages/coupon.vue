<template>
  <div>
    <div class="vld-parent">
      <loading :active.sync="isLoading"></loading>
    </div>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openCouponModal(true)">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th width="150">折扣百分比</th>
          <th width="150">到期日</th>
          <th width="80">是否啟用</th>
          <th width="150">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ item.due_date | date }}</td>
          <td class="text-center">
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td
            class="btn-group border-0"
            role="group"
            aria-label="Basic example"
          >
            <button
              class="btn btn-outline-primary btn-sm"
              @click="openCouponModal(false, item)"
            >
              編輯
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="deleteCoupon(item)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Coupon-->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white py-3">
            <h5 class="modal-title" id="exampleModalLabel">建立新的優惠券</h5>
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
            <div class="form-group">
              <label for="title">標題</label>
              <input
                type="text"
                class="form-control"
                id="title"
                placeholder="請輸入標題"
                v-model="tempCoupon.title"
              />
            </div>
            <div class="form-group">
              <label for="code">優惠碼</label>
              <input
                type="text"
                class="form-control"
                id="code"
                placeholder="請輸入標題"
                v-model="tempCoupon.code"
              />
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input
                type="date"
                class="form-control"
                id="due_date"
                placeholder="請輸入標題"
                v-model="due_date"
              />
            </div>
            <div class="form-group">
              <label for="percent">折扣百分比</label>
              <input
                type="number"
                class="form-control"
                id="percent"
                placeholder="請輸入標題"
                v-model="tempCoupon.percent"
              />
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="is_enabled"
                name="is_enabled"
                v-model="tempCoupon.is_enabled"
                :true-value="1"
                :false-value="0"
              />
              <label class="form-check-label" for="is_enabled">
                是否啟用
              </label>
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
            <button type="button" class="btn btn-primary" @click="updateCoupon">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>





<script>
import $ from "jquery";

export default {
  data() {
    return {
      coupons: [],
      tempCoupon: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false,
        fileDone: false,
      },
      pagination: {},
      due_date: new Date(),
    };
  },
  watch: {
    due_date() {
      const timestamp = Math.floor(new Date(this.due_date) / 1000);
      this.tempCoupon.due_date = timestamp;
    },
  },
  methods: {
    getCoupons(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        // console.log(response);
        vm.isLoading = false;
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
        // console.log(vm.pagination);
      });
    },

    openCouponModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        const dateAndtime = new Date(this.tempCoupon.due_date * 1000)
          .toISOString()
          .split("T");
        this.due_date = dateAndtime[0];
        this.isNew = false;
      }
      $("#couponModal").modal("show");
    },

    updateCoupon() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      const vm = this;
      let httpMethod = `post`;
      if (!vm.isNew) {
        vm.due_date = new Date(vm.tempCoupon.due_date * 1000);
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = `put`;
      }
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
        if (response.data) {
          alert(response.data.message);
          $("#couponModal").modal("hide");
          this.getCoupons();
        } else {
          $("#couponModal").modal("hide");
          this.getCoupons();
          console.log("新增失敗");
        }
      });
    },

    deleteCoupon(item) {
      // this.tempCoupon = Object.assign({}, item);
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${item.id}`;
      this.$http.delete(api).then((response) => {
         console.log(response);
        this.getCoupons();
      });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
