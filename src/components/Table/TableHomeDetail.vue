<template>
  <tr class="table__detail">
    <td colspan="7" class="table-home-detail">
      <ul>
        <li>
          <b>Cудья</b>

          <span>
            {{ detailsData.judge }}
          </span>
        </li>

        <li>
          <b>Истец</b>

          <span
            v-for="(plaintiff, index) in detailsData.plaintiffs"
            :key="index"
          >
            {{ plaintiff }}
          </span>
        </li>

        <li>
          <b>Ответчик</b>

          <span
            v-for="(defendant, index) in detailsData.defendants"
            :key="index"
          >
            {{ defendant }}
          </span>
        </li>

        <li>
          <b>Адвокат</b>

          <span v-for="(lawyer, index) in detailsData.lawyers" :key="index">
            {{ lawyer }}
          </span>
        </li>

        <li>
          <b>Прокурор</b>

          <span
            v-for="(prosecutor, index) in detailsData.prosecutors"
            :key="index"
          >
            {{ prosecutor }}
          </span>
        </li>
        <li></li>
      </ul>
    </td>
  </tr>
</template>

<script>
export default {
  name: "TableHomeDetail",
  props: {
    detailsData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    console.log("this.detailsData")
    console.log(this.detailsData)
  }
};
</script>

<style scoped></style>
