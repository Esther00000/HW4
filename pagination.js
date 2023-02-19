export default {
    template : `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <!-- 前一頁
      1. disabled : !pages.has_pre : 幫沒有前一頁時禁用
      2. 觸發 元件的 $emit 方法並代入參數
      -->
      <li class="page-item" :class="{ disabled : !pages.has_pre}">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="paginate(pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <!-- 頁碼
      1. :class="{active : page === pages.current_page}" : 設定當前頁碼樣式綁定
      2. 觸發 元件的 $emit 方法並代入參數
      -->
      <li
        class="page-item"
        v-for="page in pages.total_pages"
        :key="page+'page'"
        :class="{active : page === pages.current_page}"
      >
        <a class="page-link" href="#" @click.prevent="paginate(page)">{{page}}</a>
      </li>

      <!-- 下一頁
       1. disabled : !pages.has_next : 幫沒有下一頁時禁用
       2. 觸發 元件的 $emit 方法並代入參數
      -->
      <li class="page-item" :class="{ disabled : !pages.has_next}">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="paginate(pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
  props : ['pages'],
    methods : {
        paginate(target_page){
            this.$emit('paginated',target_page)
        }
    }
}