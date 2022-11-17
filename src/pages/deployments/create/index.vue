<template>
  <div class="page-container">
    <div class="page-wrapper">
      <section class="page-header">
        <!-- <K3PageTitle /> -->
        <h1>Create Deployment</h1>
      </section>
      <section class="page-content">
        <!-- Content here -->
        <div class="flex flex-row text-2xl mb-5 h-fit w-fit">
          <div class="flex flex-column">
            <div class="bg-white border-1 w-auto h-fit p-5 py-0 mr-5 mb-5">
              <h3>Deployment</h3>
              <div class="field grid">
                <label for="firstname3" class="col-fixed w-10rem">배포명</label>
                <div class="col">
                  <K3InputText type="text" v-model="deploymentNameText" placeholder="Input Deployment Name" />
                </div>
              </div>

              <div class="field grid">
                <label for="firstname3" class="col-fixed w-10rem">배포 중요도</label>
                <div class="col">
                  dropdown
                </div>
              </div>
            </div>

            <div class="bg-white border-1 w-auto h-full p-5 py-0 mr-5 mb-5" v-if="modelpackagesGetID.targetType != 'Regression'">
              <h3>Model Package</h3>
              <div class="field grid" v-for="(col, index) in modelPackageForBinary" :key="index">
                <label for="firstname3" class="col-fixed w-17rem">{{col.header}}</label>
                <div class="col"> {{col.field}} </div>
              </div>
            </div>

            <template v-else>
              <h3>Model Package</h3>
              <div class="field grid" v-for="(col, index) in modelPackageForReg" :key="index">
                <label for="firstname3" class="col-fixed w-17rem">{{col.header}}</label>
                <div class="col"> {{col.field}} </div>
              </div>
            </template>
          </div>

          <div class="flex flex-column">
            <div class="bg-white border-1 w-auto h-full p-5 py-0 mr-5 mb-5">
              <h3>Options</h3>

              <div class="field grid">
                <label for="firstname3" class="col-fixed">Association ID</label>
                <div class="col">
                  <K3InputText type="text" v-model="associationIDText" placeholder="Input Association ID" />
                </div>
              </div>

              <div class="field grid">
                <label for="firstname3" class="col-fixed w-20rem">Enable feature drift tracking</label>
                <div class="col">
                  <K3InputSwitch v-model="featureDriftTrackingChk" />
                </div>
              </div>

              <div class="field grid">
                <label for="firstname3" class="col-fixed w-20rem">Accuracy analyze</label>
                <div class="col">
                  <K3InputSwitch v-model="accurancyAnalyzeChk" />
                </div>
              </div>

              <div class="field grid">
                <label for="firstname3" class="col-fixed w-20rem">associationIDInFeature</label>
                <div class="col">
                  <K3InputSwitch v-model="accurancyAnalyzeChk" />
                </div>
              </div>
            </div>

            <!-- <div class="bg-white border-1 w-auto h-full p-5 py-0 mr-5 mb-5">
              <h3>Actuals</h3>
              <div class="field grid">
                <label for="firstname3" class="col-fixed">TargetLabel</label>
                <div class="col">
                  <K3InputText v-model="targetLabelText" placeholder="Input Target Label" />
                </div>
              </div>

              <div class="field grid">
                <label for="firstname3" class="col-fixed">AssociationColumn</label>
                <div class="col">
                  <K3InputText v-model="associationColumnText" placeholder="Input AssociationColumn" />
                </div>
              </div>

              <div class="field grid">
                <label for="firstname3" class="col-fixed">FileUpload</label>
                <div class="col">
                  <K3FileUpload mode="basic" name="demo[]" :customUpload="true" @upload="onUpload" />
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <!-- Content here -->
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
const route = useRoute();
const ModelPackageID = route.query.MPID;
const { modelpackagesGetID, isFetchMPID, isStatusCodeMPID, isErrorMsgMPID, fetchMPID } = useAllService().getModelPackagesID(String(ModelPackageID));

// Page meta
definePageMeta({ layout: 'default', title: 'Create Deployment', public: true })

// deployment
const deploymentNameText = ref();
const deploymentDropImportance = ref();

// modelpackage
const modelPackageForBinary = ref([]);
const modelPackageForReg = ref([]);

// options
const associationIDText = ref();
const featureDriftTrackingChk = ref(false);
const accurancyAnalyzeChk = ref(false);

// Actuals
const targetLabelText = ref();
const associationColumnText = ref();

// Watch
watch(()=> modelpackagesGetID?.value, (newvalue, oldvalue) => {
  if (newvalue?.TargetType === "Regression"){
    modelPackageForReg.value.push({header: 'Package Name',               field: newvalue?.name});
    modelPackageForReg.value.push({header: 'TargetType',                 field: newvalue?.targetType});
    modelPackageForReg.value.push({header: 'Threshould',                 field: newvalue?.predictionThreshold});
    modelPackageForReg.value.push({header: 'Training Dataset',           field: newvalue?.trainingDatasetName});
    modelPackageForReg.value.push({header: 'Holdout Dataset',            field: newvalue?.holdoutDatasetName});
  }else{
    modelPackageForBinary.value.push({header: 'Package Name',            field: newvalue?.name});
    modelPackageForBinary.value.push({header: 'TargetType',              field: newvalue?.targetType});
    modelPackageForBinary.value.push({header: 'PredictionTarget Name',   field: newvalue?.predictionTargetName});
    modelPackageForBinary.value.push({header: 'PositiveClassLabel',      field: newvalue?.positiveClassLabel});
    modelPackageForBinary.value.push({header: 'NegativeClassLabel',      field: newvalue?.negativeClassLabel});
    modelPackageForBinary.value.push({header: 'Threshould',              field: newvalue?.predictionThreshold});
    modelPackageForBinary.value.push({header: 'Training Dataset',        field: newvalue?.trainingDatasetName});
    modelPackageForBinary.value.push({header: 'Holdout Dataset',         field: newvalue?.holdoutDatasetName});
  }
})


// Package Name
// TargetType
// Threshould
// Training Dataset
// Holdout Dataset

// Package Name
// TargetType
// PredictionTarget Name
// PositiveClassLabel
// NegativeClassLabel
// Threshould
// Training Dataset
// Holdout Dataset

onMounted(() => {
  fetchMPID();
})
// Events

// Logics (like api call, etc)
</script>

<style scoped lang="scss">

</style>