<template>
  <div>
    <div class="vld-parent">
      <loading :active.sync="isLoading"></loading>
    </div>
    <table class="table mt-4"> 
      <thead>
        <tr>
          <th width="120">購買時間</th>
          <th>Email</th>
          <th width="120">購買品項</th>
          <th width="120">應付金額</th>
          <th width="80">是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id">
          <td>{{ item.create_at | date }}</td>
          <td>{{ item.user.email }}</td>
          <td class="text-right">
            <ul class="list-unstyled">
              <li v-for="product in item.products" :key="product.id">
                   {{ product.title }}
              </li>
            </ul>
          </td>
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
          </td>
        </tr>
      </tbody>
    </table> 

    <!-- pagination -->
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: !pagination.has_pre }">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          class="page-item"
          v-for="page in pagination.total_pages"
          :key="page"
          :class="{ active: pagination.current_page === page }"
        >
          <a class="page-link" href="#" @click.prevent="getCoupon(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !pagination.has_next }">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Modal -->

    <!-- Modal Delete -->
  </div>
</template>





<script>
import $ from "jquery";

export default {
  data() {
    return {
      orders: [],
      isLoading: false,
      pagination: {},
    };
  },
  methods: {
    getOrders(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        // console.log(response);
        vm.isLoading = false;
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
        console.log(vm.orders);
      });
    },

    openModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        this.isNew = false;
      }
      $("#productModal").modal("show");
    },

  },
  created() {
    this.getOrders();
  },
};
</script>
