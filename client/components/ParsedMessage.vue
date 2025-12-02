<script lang="ts">
import {defineComponent, PropType} from "vue";
import parse from "../js/helpers/parse";
import type {ClientMessage, ClientNetwork, ClientChan} from "../js/types";

export default defineComponent({
	name: "ParsedMessage",
	props: {
		text: String,
		message: {type: Object as PropType<ClientMessage | string>, required: false},
		network: {type: Object as PropType<ClientNetwork>, required: false},
		channel: {type: Object as PropType<ClientChan>, required: false},
	},
	render() {
		return parse(
			typeof this.text !== "undefined" ? this.text : this.message.text,
			this.message,
			this.network,
			this.channel
		);
	},
});
</script>
