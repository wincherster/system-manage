<template>
  <div class="tzx-quill-editor-container">
    <quill-editor v-model="content"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)">
      <div id="toolbar" slot="toolbar">
        <div class='group'>
          <span class="ql-formats">
            <select class="ql-font">
              <option selected>默认</option>
              <option value="微软雅黑">微软雅黑</option>
              <option value="宋体">宋体</option>
              <option value="黑体">黑体</option>
              <option value="幼圆">幼圆</option>
              <option value="仿宋">仿宋</option>
            </select>
          </span>
        </div>
        <div class='group'>
          <span class="ql-formats">
            <select class="ql-size">
              <option selected>默认</option>
              <option value="12px">12</option>
              <option value="16px">16</option>
              <option value="18px">18</option>
              <option value="20px">20</option>
              <option value="24px">24</option>
              <option value="36px">36</option>
              <option value="48px">48</option>
              <option value="72px">72</option>
            </select>
          </span>
        </div>
        <div class='group'>
          <span class="ql-formats"><button type="button" class="tzx-jc ql-bold"></button></span>
          <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
          <span class="ql-formats"><button type="button" class="ql-underline"></button></span>
        </div>
        <div class='group'>
          <span class="ql-formats"><button type="button" class="ql-link" value="link"></button></span>
        </div>
        <div class='group'>
          <span class="ql-formats">
            <el-upload
              ref="uploadImage"
              class="image-uploader"
              :action="url"
              :show-file-list="false"
              :before-upload="beforeImageUpload"
              :on-success="handleImageSuccess"
              name="fileToUpload">
              <div class="desc-container">
                <i class="icon el-icon-picture"></i>
              </div>
            </el-upload>
          </span>
        </div>
        <div class='group'>
          <span class="ql-formats"><button type="button" class="ql-align" value=""></button></span>
          <span class="ql-formats"><button type="button" class="ql-align" value="center"></button></span>
          <span class="ql-formats"><button type="button" class="ql-align" value="right"></button></span>
          <span class="ql-formats"><button type="button" class="ql-align" value="justify"></button></span>
        </div>
        <div class='group'>
          <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
          <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
        </div>
        <div class='group'>
          <span class="ql-formats"><button type="button" class="ql-code-block"></button></span>
        </div>
      </div>
    </quill-editor>
  </div>
</template>
<script>
  import '../assets/less/tzx-quill-editor.css'
  import EventBus from '../utils/EventBus.js'
  import { Quill } from 'vue-quill-editor'
  import ImageResize from 'quill-image-resize-module'
  Quill.register('modules/imageResize', ImageResize)
  var Size = Quill.import('attributors/style/size')
  Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '36px', '48px', '72px']
  Quill.register(Size, true)
  var Font = Quill.import('attributors/style/font')
  Font.whitelist = ['微软雅黑', '宋体', '黑体', '幼圆', '仿宋', 'PingFangSC-Regular']
  Quill.register(Font, true)
  export default {
    watch: {
      editorContent (value) {
        this.content = this.editorContent
      },
      content (value) {
        EventBus.$emit('getContent', value)
      }
    },
    props: ['editorContent'],
    data () {
      return {
        editorOption: {
          placeholder: '请输入内容...',
          theme: 'snow',
          modules: {
            toolbar: '#toolbar',
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            },
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
            }
          }
        },
        content: this.editorContent,
        url: `${process.env.API_ROOT}/organization/upload/uploadFile`,
        selectionIndex: ''
      }
    },
    methods: {
      beforeImageUpload (file) {
        return this.beforeUpload(file, 2 * 1024)
      },
      handleImageSuccess (res, file) {
        this.uploadSuccess(res, file, url => {
          this.editor.insertEmbed(this.selectionIndex, 'image', url)
        })
      },
      beforeUpload (file, limitK) {
        const isJPGPNG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLtLimit = file.size < limitK * 1024
        if (!isJPGPNG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!')
        }
        if (!isLtLimit) {
          this.$message.error(`上传图片大小不能超过 ${limitK}K!`)
        }
        return isJPGPNG && isLtLimit
      },
      uploadSuccess (res, file, callback) {
        try {
          if (res.error === 0) {
            callback(res.url)
            this.$message({ type: 'success', message: '上传成功' })
          } else {
            this.$message({ type: 'error', message: '上传失败' })
          }
        } catch (error) {
          this.$message({ type: 'error', message: '上传失败' })
        }
      },
      onEditorBlur (editor) {
        this.selectionIndex = editor.selection.savedRange.index
      }
    },
    computed: {
      editor () {
        return this.$refs.myQuillEditor.quill
      }
    }
  }
</script>




