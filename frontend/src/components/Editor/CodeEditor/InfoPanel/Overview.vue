<template>
  <div class="overview">
    <section>
      <h3>File Details</h3>
      <div>
        <table>
          <tr v-if="file.type === 'endpoint'">
            <th>Endpoint</th>
            <td>
              {{ file.method }}
              {{ file.path }}
            </td>
          </tr>
          <tr v-if="file.type === 'function'">
            <th>Function</th>
            <td>{{ file.name }}</td>
          </tr>
        </table>
      </div>
    </section>
    <div class="menu">
      <div class="environments">
        <a href="">dev</a>
        <a href="">prod</a>
      </div>
      <div class="time">
        <a href="">1h</a>
        <a href="">6h</a>
        <a href="">12h</a>
        <a href="">24h</a>
      </div>
    </div>
    <section>
      <h3>Invocations</h3>
      <TrendChart
          :datasets="[{
            data: [10, 50, 20, 100, 40, 60, 80],
            smooth: true,
            fill: true
          }]"
          :grid="{
            verticalLines: true,
            horizontalLines: true
          }"
          :labels="{
            xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            yLabels: 5
          }"
        :min="0">
      </TrendChart>
    </section>
    <section>
      <h3>Responses</h3>
      <TrendChart
          :datasets="[{
            data: [10, 50, 20, 100, 40, 60, 80],
            smooth: true,
            fill: true
          }]"
          :grid="{
            verticalLines: true,
            horizontalLines: true
          }"
          :labels="{
            xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            yLabels: 5
          }"
          :min="0">
      </TrendChart>
    </section>
    <section>
      <h3>Latency</h3>
      <TrendChart
          :datasets="[{
            data: [10, 50, 20, 100, 40, 60, 80],
            smooth: true,
            fill: true
          }]"
          :grid="{
            verticalLines: true,
            horizontalLines: true
          }"
          :labels="{
            xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            yLabels: 5
          }"
          :min="0">
      </TrendChart>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object
    }
  }
}
</script>