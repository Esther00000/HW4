import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import pagination from './pagination.js';

let productModal;
let delProductModal;



const app = createApp({
    data() {
        return {
            apiUrl:'https://vue3-course-api.hexschool.io/v2',
            apiPath:'esther-hexschool',
            products:[], //商品陣列
            isNew : false, //區分是新增產品還是編輯產品
            tempProduct:{ //單一商品
                imagesUrl:[], //避免內層圖片陣列出錯
            },
            page:{} //儲存分頁資料
        }
    },
    methods: {
        //驗證是否登入成功
        checkAdmin() {
            const url =`${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then(() => {
                    //取得商品資料
                    this.getData()
                })
                .catch((err) => {
                    alert(err.response.data.message);
                    //返回登入畫面
                    window.location = 'login.html';
                })
        },
        //取得商品所有資料
        getData(page = 1) { // 預設值為1
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
            axios.get(url)
                .then((response) => {
                    //取得的商品資料放入商品陣列中
                    this.products = response.data.products
                    //儲存頁面
                    this.page = response.data.pagination
                })
                .catch((err) => {
                    alert(err.response.data.message)
                })
        },
        //更新商品資料 (編輯-put or 新增-post)
        updateProduct() {
            //利用變數作為方法及路徑以利其轉換
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post'
            //用this.isNew判斷要用哪個API方法
            //判斷此商品是否是為新增  否 -> put
            if(!this.isNew) { //不是新增 -> put編輯
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }

            //更新商品資料
            //axios.propName => axios['propName']
            //axios['propName'](path,{parameter})
            axios[http](url,{data : this.tempProduct})
                .then((response) => {
                    alert(response.data.message);
                    productModal.hide() // 將視窗關閉
                    this.getData() //取得資料重新渲染
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })

            
        },
        //打開Modal
        //btnType : 傳入參數作為辨識是點擊了哪個按鍵的功能(新增,編輯,刪除),區分是新增產品,編輯產品或是刪除產品
        //item : 指定商品物件資料
        openModal(btnType,item) {
            //判斷點擊使用哪個功能的按鍵 -> 以傳入參數作為辨別
            //新增功能
            if(btnType === 'new') {
                //代入初始化資料 
                //建立一空白商品上傳視窗表單
                this.tempProduct = {
                    imagesUrl : [],
                },
                this.isNew = true
                //開啟商品視窗
                productModal.show()
            }else if (btnType === 'edit') {//編輯功能
                //代入當前產品資料
                //複製指定商品物件放入tempProduct,避免更動到原始資料
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            }else if(btnType === 'delete'){//刪除功能
                //複製指定商品物件放入tempProduct取id使用
                this.tempProduct = { ...item };
                //開啟刪除商品視窗
                delProductModal.show()
            }
        },
        //刪除商品
        delProduct(){
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then((response) => {
                    alert(response.data.message);
                    //關閉視窗
                    delProductModal.hide();
                    //重新渲染商品
                    this.getData();
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        },
        //上傳圖片
        createImage() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    },
    mounted() {
        //bootstrap
        //1.初始化 new
        //2.呼叫方法 show , hide...ect
        //初始化 : 創建一視窗Modal : productModal
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
          keyboard: false  //關閉鍵盤事件 : 取消用ESC鍵關閉
        });
        // productModal.show() //做為測試是否創建modal成功
        //創建一視窗Modal : delProductModal
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
          keyboard: false //關閉鍵盤事件 : 取消用ESC鍵關閉
        });
        // delProductModal.show() //做為測試是否創建modal成功
    
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        //把取出的token放入headers裡一起發送請求
	    axios.defaults.headers.common["Authorization"] = token;
        // 確認是否登入
        this.checkAdmin();
    },
    components : {pagination}
})

//新增/編輯元件
app.component('product-modale',{
    template : '#product-modale',
    props:['tempProduct','isNew'],
    methods : {
        updateData(){ // 元件模板觸發的方法 
            this.$emit('update') // 透過$emit('自定義事件') 觸發 外層元件的方法更新狀態
        }
    }
})

//刪除元件
app.component('del-product-modal',{
    template:'#del-product-modal',
    props:['tempProduct'],
    methods :{
        delItem(){
            this.$emit('del')
        }
    }
})

//分頁元件
// app.component('pagination',{
//     template : '#pagination',
//     props : ['pages'],
//     methods : {
//         paginate(target_page){
//             this.$emit('paginated',target_page)
//         }
//     }
// })



app.mount('#app');