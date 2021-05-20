<template>
    <!-- Modal -->
    <div class="modal fade" id="fileModal">
      <div class="modal-dialog modal-dialog-center" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-dark">Upload Image(jpeg, png, 1mb max)</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            > 
              <!-- <span aria-hidden="true">&times;</span> -->
            </button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="form-group">
                <input
                  type="file"
                  id="file"
                  name="file"
                  class="form-control"
                  @change="addFile"
                />
              </div>
              
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button @click="sendFile" type="button" class="btn btn-primary">
              Send File
            </button>
          </div>
        </div>
      </div>
    </div>
</template>


<!---------------------------------SCRIPTS----------------------------->
<script>
//imoprts
import mime from 'mime-types'

export default {
    name: 'FileModal',
    data(){
        return {
                file: null,
                authorized: ['image/jpeg', 'image/jpg', 'image/png']
            }
    },
    methods:{
        isValid(filename) {
                let index = this.authorized.indexOf(mime.lookup(filename))
                return index !== -1
            },

        addFile(e){
             let files = e.target.files
                console.log(files)
                if(files.length === 1) {
                    this.file = files[0]
                }
        },
        sendFile(){
            if(this.file !== null) {
                    if(this.isValid(this.file.name)) {
                        let metadata = {contentType: mime.lookup(this.file.name)}
                        this.$parent.uploadFile(this.file, metadata)
                        $("#fileModal").modal('hide');
                    }
                }
        },
         resetForm() {
                $('.form').trigger('reset')
                this.file = null
            }
    }
}
</script>