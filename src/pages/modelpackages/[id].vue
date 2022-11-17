<template>
  <div class="page-container">
    <div class="page-wrapper">
      <section class="page-header">
        <K3PageTitle />
      </section>
      <section class="page-content">
        <h2>Summary</h2>
        <!-- Content here -->
        <K3Splitter class="h-25rem mr-5">
          <K3SplitterPanel class="flex align-items-align-items-start justify-content-left">
            <div class="flex flex-column m-3">
              <div class="field grid">
                <label for="firstname3" class="col-fixed w-7rem">이름</label>
                <div class="col">
                  <input id="firstname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-7rem">설명</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-7rem">모델 이름</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-7rem">training Data</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-7rem">holdout Data</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-7rem">프레임워크</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-7rem">프로젝트</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>
            </div>
          </K3SplitterPanel>

          <K3SplitterPanel class="flex align-items-align-items-start justify-content-left">
            <div class="flex flex-column m-3">
              <div class="field grid">
                <label for="firstname3" class="col-fixed w-9rem">Target Column</label>
                <div class="col">
                  <input id="firstname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-9rem">Prediction Type</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-9rem">Positive Class</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-9rem">Negative Class</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-9rem">Threshold</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-9rem">Created by</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

              <div class="field grid">
                <label for="lastname3" class="col-fixed w-9rem">Created Time</label>
                <div class="col">
                  <input id="lastname3" type="text"
                    class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary">
                </div>
              </div>

            </div>
          </K3SplitterPanel>
        </K3Splitter>
        <!-- Content here -->
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
// Page meta
definePageMeta({ layout: 'default', title: 'Model Package > wine_tensor_pack', public: true })
// Props
// const props = defineProps({}),
// Emits
// const emits = defineEmits(['eventname']),
// Properties
// Compputed
// Watcher
// Methods
// Events
// Logics (like api call, etc)
</script>

<style scoped lang="scss">
</style>