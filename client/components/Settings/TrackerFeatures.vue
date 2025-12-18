<template>
	<div class="settings-section">
		<h1 class="settings-heading">Tracker Features</h1>
		<p class="settings-description">Configure MAM-specific features and tracker integrations</p>

		<!-- Master Toggle -->
		<div class="settings-group">
			<label class="opt">
				<input
					type="checkbox"
					name="trackerFeaturesEnabled"
					:checked="settings.trackerFeaturesEnabled"
					@change="
						$emit('change', {
							name: 'trackerFeaturesEnabled',
							value: $event.target.checked,
						})
					"
				/>
				Enable tracker features
			</label>
			<p class="settings-help">Master toggle for all tracker-specific features</p>
		</div>

		<template v-if="settings.trackerFeaturesEnabled">
			<!-- ============================================
                 NETWORK DETECTION
                 ============================================ -->
			<h2 class="settings-subheading">Network Detection</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="forceMAMFormatting"
					:checked="settings.forceMAMFormatting"
					@change="
						$emit('change', {name: 'forceMAMFormatting', value: $event.target.checked})
					"
				/>
				Force MAM formatting on all networks
			</label>
			<p class="settings-help">
				Apply MAM badges, colors, and grouping to all IRC networks (not just MAM). Useful if
				you use MAM usernames on other networks like #thelounge on Libera.Chat.
			</p>

			<!-- ============================================
                 USERNAME COLORS
                 ============================================ -->
			<h2 class="settings-subheading">Username Colors</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="colorIRCModes"
					:checked="settings.colorIRCModes"
					@change="$emit('change', {name: 'colorIRCModes', value: $event.target.checked})"
				/>
				Color usernames by IRC mode
			</label>
			<p class="settings-help">
				Apply colors to usernames based on IRC modes: Owner (~) = Gold, Admin (&amp;) =
				Violet, Op (@) = Red, Half-Op (%) = Orange, Voice (+) = Blue
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="useOfficialColors"
					:checked="settings.useOfficialColors"
					@change="
						$emit('change', {name: 'useOfficialColors', value: $event.target.checked})
					"
				/>
				Use official MAM colors
			</label>
			<p class="settings-help">
				Apply official MAM class colors to usernames (overrides IRC mode colors when MAM
				class is detected). Staff = Red, Mods = Purple, Elite = Gold, VIP = Teal, Power User
				= Blue
			</p>

			<!-- ✅ NEW: Background color toggle -->
			<label class="opt">
				<input
					type="checkbox"
					name="useBackgroundColors"
					:checked="settings.useBackgroundColors"
					@change="
						$emit('change', {name: 'useBackgroundColors', value: $event.target.checked})
					"
				/>
				Use background colors (bold style)
			</label>
			<p class="settings-help">
				Apply bold colored backgrounds to MAM class usernames (Discord-style highlighting).
				Overrides text colors when enabled.
			</p>

			<!-- ============================================
                 USERLIST DISPLAY
                 ============================================ -->
			<h2 class="settings-subheading">Userlist Display</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="enableClassGrouping"
					:checked="settings.enableClassGrouping"
					@change="
						$emit('change', {name: 'enableClassGrouping', value: $event.target.checked})
					"
				/>
				Enable class grouping
			</label>
			<p class="settings-help">
				Group users by MAM class (Staff, Elite, VIP, etc.) instead of IRC modes
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="showClassBadges"
					:checked="settings.showClassBadges"
					@change="
						$emit('change', {name: 'showClassBadges', value: $event.target.checked})
					"
				/>
				Show class badges
			</label>
			<p class="settings-help">
				Display class badges (PU, VIP, Elite, etc.) next to usernames
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="compactBadges"
					:checked="settings.compactBadges"
					:disabled="!settings.showClassBadges"
					@change="$emit('change', {name: 'compactBadges', value: $event.target.checked})"
				/>
				Compact badges
			</label>
			<p class="settings-help">Use smaller, more compact class badges</p>

			<label class="opt">
				<input
					type="checkbox"
					name="showClassTooltips"
					:checked="settings.showClassTooltips"
					:disabled="!settings.showClassBadges"
					@change="
						$emit('change', {name: 'showClassTooltips', value: $event.target.checked})
					"
				/>
				Show class tooltips
			</label>
			<p class="settings-help">Display full class name on hover</p>

			<label class="opt">
				<input
					type="checkbox"
					name="stickyGroupHeaders"
					:checked="settings.stickyGroupHeaders"
					@change="
						$emit('change', {name: 'stickyGroupHeaders', value: $event.target.checked})
					"
				/>
				Sticky group headers
			</label>
			<p class="settings-help">Keep group headers visible when scrolling</p>

			<label class="opt">
				<input
					type="checkbox"
					name="showUserCount"
					:checked="settings.showUserCount"
					@change="$emit('change', {name: 'showUserCount', value: $event.target.checked})"
				/>
				Show user count in headers
			</label>
			<p class="settings-help">Display number of users in each group</p>

			<!-- ============================================
                 QUEUE DETECTION
                 ============================================ -->
			<h2 class="settings-subheading">Queue Detection</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="enableQueueDetection"
					:checked="settings.enableQueueDetection"
					@change="
						$emit('change', {
							name: 'enableQueueDetection',
							value: $event.target.checked,
						})
					"
				/>
				Enable queue detection
			</label>
			<p class="settings-help">
				Automatically detect and format MAM queue channels (#anonamouse.net, #help)
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="autoExpandQueue"
					:checked="settings.autoExpandQueue"
					:disabled="!settings.enableQueueDetection"
					@change="
						$emit('change', {name: 'autoExpandQueue', value: $event.target.checked})
					"
				/>
				Auto-expand queue
			</label>
			<p class="settings-help">
				Automatically expand queue section when entering queue channel
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="animateQueue"
					:checked="settings.animateQueue"
					:disabled="!settings.enableQueueDetection"
					@change="$emit('change', {name: 'animateQueue', value: $event.target.checked})"
				/>
				Animate queue
			</label>
			<p class="settings-help">Add pulse animation to queue users</p>

			<label class="opt">
				<input
					type="checkbox"
					name="playQueueSound"
					:checked="settings.playQueueSound"
					:disabled="!settings.enableQueueDetection"
					@change="
						$emit('change', {name: 'playQueueSound', value: $event.target.checked})
					"
				/>
				Play queue sound
			</label>
			<p class="settings-help">Play notification sound when queue position changes</p>

			<!-- ============================================
                 VISUAL EFFECTS
                 ============================================ -->
			<h2 class="settings-subheading">Visual Effects</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="staffGlowEffect"
					:checked="settings.staffGlowEffect"
					@change="
						$emit('change', {name: 'staffGlowEffect', value: $event.target.checked})
					"
				/>
				Staff glow effect
			</label>
			<p class="settings-help">Add subtle glow effect to staff usernames</p>

			<label class="opt">
				<input
					type="checkbox"
					name="fadeInactiveUsers"
					:checked="settings.fadeInactiveUsers"
					@change="
						$emit('change', {name: 'fadeInactiveUsers', value: $event.target.checked})
					"
				/>
				Fade inactive users
			</label>
			<p class="settings-help">Reduce opacity of users who haven't spoken recently</p>

			<!-- ============================================
                 DATA MANAGEMENT
                 ============================================ -->
			<h2 class="settings-subheading">Data Management</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="enableHostmaskCache"
					:checked="settings.enableHostmaskCache"
					@change="
						$emit('change', {name: 'enableHostmaskCache', value: $event.target.checked})
					"
				/>
				Enable hostmask cache
			</label>
			<p class="settings-help">
				Cache user hostmasks locally for faster MAM class detection (stored in localStorage)
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="autoWhois"
					:checked="settings.autoWhois"
					:disabled="!settings.enableHostmaskCache"
					@change="$emit('change', {name: 'autoWhois', value: $event.target.checked})"
				/>
				Auto-WHOIS users
			</label>
			<p class="settings-help">
				Automatically WHOIS users to populate hostmask cache (may trigger flood protection)
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="trackQueueStats"
					:checked="settings.trackQueueStats"
					@change="
						$emit('change', {name: 'trackQueueStats', value: $event.target.checked})
					"
				/>
				Track queue statistics
			</label>
			<p class="settings-help">Collect and store queue statistics for analytics dashboard</p>

			<!-- ============================================
                 NOTIFICATIONS
                 ============================================ -->
			<h2 class="settings-subheading">Notifications</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="notifyStaffJoin"
					:checked="settings.notifyStaffJoin"
					@change="
						$emit('change', {name: 'notifyStaffJoin', value: $event.target.checked})
					"
				/>
				Notify on staff join
			</label>
			<p class="settings-help">
				Show desktop notification when staff members join queue channels (not synced across
				devices)
			</p>

			<!-- ============================================
                 ADVANCED
                 ============================================ -->
			<h2 class="settings-subheading">Advanced</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="enableMamApi"
					:checked="settings.enableMamApi"
					@change="$emit('change', {name: 'enableMamApi', value: $event.target.checked})"
				/>
				Enable MAM API integration
			</label>
			<p class="settings-help">
				Connect to MAM API for enhanced user data (requires MAM_ID session token)
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="debugMode"
					:checked="settings.debugMode"
					@change="$emit('change', {name: 'debugMode', value: $event.target.checked})"
				/>
				Debug mode
			</label>
			<p class="settings-help">
				Enable debug logging and visual indicators (console logs only, not synced across
				devices)
			</p>

			<!-- ============================================
                 CACHE MANAGEMENT
                 ============================================ -->
			<div class="settings-group">
				<h3 class="settings-cache-heading">Cache Management</h3>

				<button class="btn btn-small" @click="clearHostmaskCache">
					Clear Hostmask Cache
				</button>
				<p class="settings-help">
					Remove all cached hostmasks from localStorage. Useful if cache becomes corrupted
					or outdated.
				</p>

				<div v-if="cacheInfo" class="cache-info">
					<p>
						<strong>Cache Status:</strong> {{ cacheInfo.count }} users cached ({{
							cacheInfo.size
						}})
					</p>
					<p><strong>Last Updated:</strong> {{ cacheInfo.lastUpdate }}</p>
				</div>
			</div>

			<!-- ============================================
                 PREVIEW
                 ============================================ -->
			<div class="settings-group">
				<h3 class="settings-cache-heading">Preview</h3>
				<div class="tracker-preview">
					<!-- IRC Mode Colors Preview -->
					<div class="preview-section">
						<h4>IRC Mode Colors:</h4>
						<div class="preview-userlist">
							<span
								:class="[
									'preview-user',
									'user-mode-owner',
									settings.colorIRCModes ? 'color-enabled' : '',
								]"
								>~Owner</span
							>
							<span
								:class="[
									'preview-user',
									'user-mode-admin',
									settings.colorIRCModes ? 'color-enabled' : '',
								]"
								>&amp;Admin</span
							>
							<span
								:class="[
									'preview-user',
									'user-mode-op',
									settings.colorIRCModes ? 'color-enabled' : '',
								]"
								>@Operator</span
							>
							<span
								:class="[
									'preview-user',
									'user-mode-half-op',
									settings.colorIRCModes ? 'color-enabled' : '',
								]"
								>%HalfOp</span
							>
							<span
								:class="[
									'preview-user',
									'user-mode-voice',
									settings.colorIRCModes ? 'color-enabled' : '',
								]"
								>+Voice</span
							>
						</div>
					</div>

					<!-- MAM Class Colors Preview -->
					<div class="preview-section">
						<h4>MAM Class Colors:</h4>
						<div class="preview-userlist">
							<span
								:class="[
									'preview-user',
									'mam-class-admin',
									settings.useOfficialColors ? 'mam-color-enabled' : '',
								]"
							>
								Admin
								<span
									v-if="settings.showClassBadges"
									class="preview-badge"
									:class="{compact: settings.compactBadges}"
									>👑 Admin</span
								>
							</span>
							<span
								:class="[
									'preview-user',
									'mam-class-mod',
									settings.useOfficialColors ? 'mam-color-enabled' : '',
								]"
							>
								Moderator
								<span
									v-if="settings.showClassBadges"
									class="preview-badge"
									:class="{compact: settings.compactBadges}"
									>🛡️ Mod</span
								>
							</span>
							<span
								:class="[
									'preview-user',
									'mam-class-elite',
									settings.useOfficialColors ? 'mam-color-enabled' : '',
								]"
							>
								Elite
								<span
									v-if="settings.showClassBadges"
									class="preview-badge"
									:class="{compact: settings.compactBadges}"
									>⭐ Elite</span
								>
							</span>
							<span
								:class="[
									'preview-user',
									'mam-class-vip',
									settings.useOfficialColors ? 'mam-color-enabled' : '',
								]"
							>
								VIP
								<span
									v-if="settings.showClassBadges"
									class="preview-badge"
									:class="{compact: settings.compactBadges}"
									>💎 VIP</span
								>
							</span>
							<span
								:class="[
									'preview-user',
									'mam-class-p-user',
									settings.useOfficialColors ? 'mam-color-enabled' : '',
								]"
							>
								PowerUser
								<span
									v-if="settings.showClassBadges"
									class="preview-badge"
									:class="{compact: settings.compactBadges}"
									>⚡ PU</span
								>
							</span>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<style scoped>
.settings-section {
	max-width: 800px;
	padding: 20px;
}

.settings-heading {
	margin: 0 0 10px;
	font-size: 1.8rem;
}

.settings-description {
	margin: 0 0 20px;
	color: #999;
	line-height: 1.5;
}

.settings-group {
	margin: 30px 0;
	padding: 20px 0;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-subheading {
	margin: 30px 0 15px;
	font-size: 1.2rem;
	font-weight: 600;
	color: #ddd;
}

.settings-cache-heading {
	margin: 0 0 10px;
	font-size: 1rem;
	font-weight: 600;
}

.settings-help {
	margin: 5px 0 15px 25px;
	font-size: 0.9rem;
	color: #999;
	line-height: 1.4;
}

.opt {
	display: flex;
	align-items: center;
	margin: 10px 0;
	cursor: pointer;
}

.opt input[type="checkbox"] {
	margin-right: 10px;
}

.opt input[type="checkbox"]:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

/* Cache Info */
.cache-info {
	margin: 15px 0;
	padding: 10px;
	background: rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	font-size: 0.9rem;
}

.cache-info p {
	margin: 5px 0;
}

/* Preview Styles */
.tracker-preview {
	background: rgba(0, 0, 0, 0.3);
	padding: 15px;
	border-radius: 4px;
	font-family: "Roboto Mono", monospace;
}

.preview-section {
	margin: 15px 0;
}

.preview-section h4 {
	margin: 0 0 10px;
	font-size: 0.9rem;
	color: #999;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.preview-userlist {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.preview-user {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 4px 8px;
	border-radius: 3px;
	background: rgba(255, 255, 255, 0.05);
	font-size: 0.95rem;
}

/* IRC Mode Colors (when enabled) */
.preview-user.user-mode-owner.color-enabled {
	color: gold !important;
}

.preview-user.user-mode-admin.color-enabled {
	color: violet !important;
}

.preview-user.user-mode-op.color-enabled {
	color: red !important;
}

.preview-user.user-mode-half-op.color-enabled {
	color: orange !important;
}

.preview-user.user-mode-voice.color-enabled {
	color: #3498db !important;
}

/* MAM Class Colors (when enabled) */
.preview-user.mam-class-admin.mam-color-enabled {
	color: violet !important;
}

.preview-user.mam-class-mod.mam-color-enabled {
	color: red !important;
}

.preview-user.mam-class-elite.mam-color-enabled {
	color: #1abc9c !important;
}

.preview-user.mam-class-vip.mam-color-enabled {
	color: #1abc9c !important;
}

.preview-user.mam-class-p-user.mam-color-enabled {
	color: #3498db !important;
}

/* Preview Badge */
.preview-badge {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 0.75em;
	padding: 2px 6px;
	border-radius: 3px;
	background: rgba(255, 255, 255, 0.1);
	margin-left: auto;
}

.preview-badge.compact {
	font-size: 0.65em;
	padding: 1px 4px;
}

/* Button */
.btn {
	padding: 8px 16px;
	border: none;
	border-radius: 4px;
	background: #3498db;
	color: white;
	cursor: pointer;
	font-size: 0.9rem;
	transition: background 0.2s;
}

.btn:hover {
	background: #2980b9;
}

.btn-small {
	padding: 6px 12px;
	font-size: 0.85rem;
}
</style>

<script lang="ts">
import {defineComponent, computed, ref, onMounted} from "vue";
import {useStore} from "../../js/store";

export default defineComponent({
	name: "TrackerFeatures",
	emits: ["change"],
	setup() {
		const store = useStore();
		const settings = computed(() => store.state.settings);
		const cacheInfo = ref<{count: number; size: string; lastUpdate: string} | null>(null);

		// Get cache info
		const getCacheInfo = () => {
			try {
				const cache = localStorage.getItem("hostmaskCache");
				if (!cache) {
					cacheInfo.value = null;
					return;
				}

				const parsed = JSON.parse(cache);
				const count = Object.keys(parsed).length;
				const size = new Blob([cache]).size;
				const sizeStr = size > 1024 ? `${(size / 1024).toFixed(1)} KB` : `${size} bytes`;

				// Get last update time (if stored)
				const lastUpdate = localStorage.getItem("hostmaskCacheTime");
				const lastUpdateStr = lastUpdate
					? new Date(parseInt(lastUpdate)).toLocaleString()
					: "Unknown";

				cacheInfo.value = {
					count,
					size: sizeStr,
					lastUpdate: lastUpdateStr,
				};
			} catch (e) {
				console.error("Error reading cache:", e);
				cacheInfo.value = null;
			}
		};

		// Clear hostmask cache
		const clearHostmaskCache = () => {
			if (confirm("Are you sure you want to clear the hostmask cache?")) {
				localStorage.removeItem("hostmaskCache");
				localStorage.removeItem("hostmaskCacheTime");
				cacheInfo.value = null;
				alert("Hostmask cache cleared!");
			}
		};

		onMounted(() => {
			getCacheInfo();
		});

		return {
			settings,
			cacheInfo,
			clearHostmaskCache,
		};
	},
});
</script>
