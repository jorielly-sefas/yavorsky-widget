<template>
  <div class="about">
    <h1>This is an about page</h1>
            <vue-bootstrap-table
                    ref="exampleTable"
                    :columns="columns"
                    :values="values"
                    :show-filter="showFilter"
                    :show-column-picker="showPicker"
                    :paginated="paginated"
                    :multi-column-sortable="multiColumnSortable"
                    :ajax="ajax"
                    :row-click-handler=handleRowFunction
                    :filter-case-sensitive=false
                    :selectable="showSelect"
            >
                <!--<template v-slot:name="slotProps">
                    <b>NAME:</b> {{slotProps.value.name}}
                </template>
                <template v-slot:description="slotProps">
                    <b>DESC:</b> {{slotProps.value.description}}
                </template>-->
            </vue-bootstrap-table>

  </div>
</template>
<script>
import VueBootstrapTable from '@/components/VueBootstrapTable.vue'

export default {
  name: 'about',
  components: {
    VueBootstrapTable
  }
}
</script>
