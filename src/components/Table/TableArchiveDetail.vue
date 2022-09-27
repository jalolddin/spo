<template>
  <tr class="table__detail">
    <td colspan="7">
      <div class="table__detail-wrap --bg-blue">
        <table class="table --simple --bg-blue --grid">
          <thead>
            <tr>
              <th class="table-second-item">
                <span>Дата/Время</span>
              </th>
              <th class="table-third-item">
                <span>Помещение</span>
              </th>
              <th>
                <span>Судья</span>
              </th>
              <th>
                <span>Секретарь</span>
              </th>
              <th>
                <span>Статус</span>
              </th>
              <th> </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="hearing in hearings" :key="hearing.id">
              <td>
                <span>
                  {{
                    `${new Date(hearing.time).getDate()}.${new Date(
                      hearing.time
                    ).getMonth()}.${new Date(hearing.time).getFullYear()}`
                  }}/{{
                    `${new Date(hearing.time).getHours()}:${new Date(
                      hearing.time
                    ).getMinutes()}`
                  }}
                </span>
              </td>
              <td>
                <span>{{hearing.room}}</span>
              </td>
              <td>
                <span>{{ hearing.judge }}</span>
              </td>
              <td>
                <span>{{ hearing.secretary }}</span>
              </td>
              <td class="">
                <div class="status-block">
                  <i>
                    <BaseIcon ico="clock"></BaseIcon>
                  </i>
                  <span>{{ hearing.status }}</span>
                </div>
              </td>
              <td class="--align-left">
                <router-link to="/detail" tag="btn">
                  <BaseButton
                    text="открыть"
                    class="--min --simple --min-height"
                  ></BaseButton>
                </router-link>
              </td>
            </tr>
            
            <!-- <tr>
              <td>
                <span>15.11.20 / 12:20</span>
              </td>
              <td>
                <span>11</span>
              </td>
              <td>
                <span>Колесников В. А.</span>
              </td>
              <td>
                <span>Мохова А. И.</span>
              </td>
              <td class="">
                <div class="status-block">
                  <i>
                    <BaseIcon ico="clock"></BaseIcon>
                  </i>
                  <span>Завершена: 00:22 мин</span>
                </div>
              </td>
              <td class="--align-left">
                <router-link to="/detail" tag="btn">
                  <BaseButton
                    text="открыть"
                    class="--min --simple --min-height"
                  ></BaseButton>
                </router-link>
              </td>
            </tr> -->

            <!-- <tr> -->
<!--              <td>-->
<!--                <span>Заседание №1</span>-->
<!--              </td>-->
              <!-- <td>
                <span>15.11.20 / 12:20</span>
              </td>
              <td>
                <span>11</span>
              </td>
              <td>
                <span>Колесников В. А.</span>
              </td>
              <td>
                <span>Мохова А. И.</span>
              </td>
              <td class="">
                <div class="status-block">
                  <i>
                    <BaseIcon ico="clock"></BaseIcon>
                  </i>
                  <span>Завершена: 00:22 мин</span>
                </div>
              </td>
              <td class="--align-left">
                <router-link to="/detail" tag="btn">
                  <BaseButton
                    text="открыть"
                    class="--min --simple --min-height"
                  ></BaseButton>
                </router-link>
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</template>

<script>
import BaseIcon from "@/components/global/BaseIcon";
import BaseButton from "@/components/global/BaseButton";
import api from "@/api/index";

export default {
  name: "TableArchiveDetail",
  components: { BaseButton, BaseIcon },
  props: {
    detailsData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      api,
      hearings: []
    };
  },
  async mounted() {
    const res = await this.api.hearings.getHearingsByNumber({
      case: this.detailsData.number
    });

    this.hearings = res.data.body.hearings;
  }
};
</script>
