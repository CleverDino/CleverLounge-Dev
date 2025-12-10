<template>
  <div class="history-viewer">
    <div class="history-header">
      <h3>Archived Chat History</h3>
      <input 
        type="date" 
        v-model="selectedDate" 
        @change="loadHistoryForDate"
      />
      <button @click="closeViewer">Close</button>
    </div>
    
    <div class="history-messages">
      <div 
        v-for="line in historyLines" 
        :key="line.id"
        class="history-line"
        v-html="formatLogLine(line)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '../js/store';

export default defineComponent({
  name: 'HistoryViewer',
  props: {
    channel: String,
    network: String,
    username: String
  },
  setup(props) {
    const store = useStore();
    const selectedDate = ref('');
    const historyLines = ref([]);
    
    const loadHistoryForDate = async () => {
      // Fetch log file via custom API endpoint
      const response = await fetch(`/api/logs/${props.username}/${props.network}/${props.channel}/${selectedDate.value}`);
      const logText = await response.text();
      
      // Parse log lines
      historyLines.value = logText.split('\n').map((line, idx) => ({
        id: idx,
        raw: line
      }));
    };
    
    const formatLogLine = (line) => {
      // Parse: 2025-12-04T13:36:15.217Z nick!user@host message
      const match = line.raw.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\s+(\S+)\s+(.+)$/);
      if (!match) return line.raw;
      
      const [, timestamp, nick, message] = match;
      const time = new Date(timestamp).toLocaleTimeString();
      
      return `<span class="time">${time}</span> <span class="nick">${nick}</span> ${message}`;
    };
    
    const closeViewer = () => {
      store.commit('hideHistoryViewer');
    };
    
    return {
      selectedDate,
      historyLines,
      loadHistoryForDate,
      formatLogLine,
      closeViewer
    };
  }
});
</script>

<style scoped>
.history-viewer {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 400px;
  background: #1a1a1e;
  border-left: 1px solid #0f0f11;
  z-index: 100;
}

.history-header {
  padding: 10px;
  border-bottom: 1px solid #0f0f11;
}

.history-messages {
  overflow-y: auto;
  height: calc(100% - 60px);
  padding: 10px;
}

.history-line {
  margin-bottom: 5px;
  font-family: monospace;
}
</style>
