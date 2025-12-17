<template>
	<div class="settings-section">
		<h1 class="settings-heading">Tracker Features</h1>
		<p class="settings-description">
			Customize CleverLounge enhancements for private tracker IRC networks (MyAnonamouse,
			Redacted, Orpheus, etc.)
		</p>

		<!-- Master Toggle -->
		<div class="settings-group">
			<label class="opt">
				<input
					type="checkbox"
					name="trackerFeaturesEnabled"
					:checked="settings.trackerFeaturesEnabled"
				/>
				Enable tracker features
			</label>
			<p class="settings-help">Master toggle for all CleverLounge tracker enhancements</p>
		</div>

		<template v-if="settings.trackerFeaturesEnabled">
			<!-- Userlist Grouping -->
			<h2 class="settings-subheading">Userlist Grouping</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="enableClassGrouping"
					:checked="settings.enableClassGrouping"
				/>
				Group users by tracker class
			</label>
			<p class="settings-help">
				Organize userlist by tracker hierarchy (Dev, Admin, Mod, VIP, User, etc.) instead of
				IRC modes
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="enableQueueDetection"
					:checked="settings.enableQueueDetection"
				/>
				Detect support/invite queues
			</label>
			<p class="settings-help">
				Show dedicated sections for queues in #help and #anonamouse.net channels
			</p>

			<!-- Visual Styling -->
			<h2 class="settings-subheading">Visual Styling</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="useOfficialColors"
					:checked="settings.useOfficialColors"
				/>
				Use official tracker class colors
			</label>
			<p class="settings-help">
				Apply colors from tracker websites (MAM green admins, RED red sysops, etc.)
			</p>

			<label class="opt">
				<input type="checkbox" name="showClassBadges" :checked="settings.showClassBadges" />
				Show class badges and icons
			</label>
			<p class="settings-help">
				Display class indicators like 👑 Admin, 💻 Dev, 🎭 VIP, etc.
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="compactBadges"
					:checked="settings.compactBadges"
					:disabled="!settings.showClassBadges"
				/>
				Use compact badge style
			</label>
			<p class="settings-help">Show text-only badges without icons (saves space)</p>

			<label class="opt">
				<input
					type="checkbox"
					name="stickyGroupHeaders"
					:checked="settings.stickyGroupHeaders"
				/>
				Sticky group headers
			</label>
			<p class="settings-help">Keep class section headers visible when scrolling userlist</p>

			<label class="opt">
				<input
					type="checkbox"
					name="showClassTooltips"
					:checked="settings.showClassTooltips"
				/>
				Show class name on hover
			</label>
			<p class="settings-help">Display full class name when hovering over badges</p>

			<!-- Visual Effects -->
			<h2 class="settings-subheading">Visual Effects</h2>

			<label class="opt">
				<input type="checkbox" name="animateQueue" :checked="settings.animateQueue" />
				Animate queue members
			</label>
			<p class="settings-help">Gently pulse users waiting in queue for visibility</p>

			<label class="opt">
				<input type="checkbox" name="staffGlowEffect" :checked="settings.staffGlowEffect" />
				Staff glow effect
			</label>
			<p class="settings-help">Add subtle glow around staff usernames</p>

			<label class="opt">
				<input
					type="checkbox"
					name="fadeInactiveUsers"
					:checked="settings.fadeInactiveUsers"
				/>
				Fade inactive users
			</label>
			<p class="settings-help">Dim users who haven't spoken recently</p>

			<!-- Data Display -->
			<h2 class="settings-subheading">Information Display</h2>

			<label class="opt">
				<input type="checkbox" name="showUserCount" :checked="settings.showUserCount" />
				Show user count per class
			</label>
			<p class="settings-help">Display number of users in each class group</p>

			<label class="opt">
				<input type="checkbox" name="showWaitTime" :checked="settings.showWaitTime" />
				Show queue wait time
			</label>
			<p class="settings-help">
				Display how long users have been waiting in queue (experimental)
			</p>

			<label class="opt">
				<input type="checkbox" name="showJoinDate" :checked="settings.showJoinDate" />
				Show MAM join date in tooltip
			</label>
			<p class="settings-help">Display when user joined MAM (requires API access)</p>

			<label class="opt">
				<input type="checkbox" name="showLastSeen" :checked="settings.showLastSeen" />
				Show last message timestamp
			</label>
			<p class="settings-help">Display when user last spoke in channel</p>

			<!-- Behavioral Features -->
			<h2 class="settings-subheading">Behavior</h2>

			<label class="opt">
				<input type="checkbox" name="autoExpandQueue" :checked="settings.autoExpandQueue" />
				Auto-expand queue section
			</label>
			<p class="settings-help">
				Automatically expand queue groups when entering queue channels
			</p>

			<label class="opt">
				<input type="checkbox" name="sortQueueByTime" :checked="settings.sortQueueByTime" />
				Sort queue by wait time
			</label>
			<p class="settings-help">Show longest-waiting users first in queue</p>

			<label class="opt">
				<input type="checkbox" name="playQueueSound" :checked="settings.playQueueSound" />
				Play sound when joining queue
			</label>
			<p class="settings-help">Audio notification when you get +v in queue channel</p>

			<label class="opt">
				<input type="checkbox" name="notifyStaffJoin" :checked="settings.notifyStaffJoin" />
				Desktop notification when staff joins
			</label>
			<p class="settings-help">Pop-up notification when staff enters the channel</p>

			<!-- Data Management -->
			<h2 class="settings-subheading">Data Management</h2>

			<label class="opt">
				<input
					type="checkbox"
					name="enableHostmaskCache"
					:checked="settings.enableHostmaskCache"
				/>
				Enable hostmask caching
			</label>
			<p class="settings-help">
				Persist tracker class information across sessions (currently: {{ cacheSize }} users)
			</p>

			<label class="opt">
				<input
					type="checkbox"
					name="autoWhois"
					:checked="settings.autoWhois"
					:disabled="!settings.enableHostmaskCache"
				/>
				Automatic WHOIS on user join
			</label>
			<p class="settings-help">Automatically collect hostmasks when users join channels</p>

			<!-- Cache Management -->
			<div class="settings-group">
				<h3 class="settings-cache-heading">Cache Management</h3>
				<p class="settings-help">
					Cache contains {{ cacheSize }} users. Export for backup or import pre-built
					cache.
				</p>
				<div class="button-group">
					<button type="button" class="btn btn-small" @click="exportCache">
						📥 Export Cache
					</button>
					<button type="button" class="btn btn-small" @click="importCache">
						📤 Import Cache
					</button>
					<button type="button" class="btn btn-small btn-danger" @click="clearCache">
						🗑️ Clear Cache
					</button>
				</div>
			</div>

			<!-- Advanced -->
			<h2 class="settings-subheading">Advanced</h2>

			<label class="opt">
				<input type="checkbox" name="enableMamApi" :checked="settings.enableMamApi" />
				Enable MAM API integration
			</label>
			<p class="settings-help">
				Fetch user profiles from MAM website (requires session token)
			</p>

			<label class="opt">
				<input type="checkbox" name="trackQueueStats" :checked="settings.trackQueueStats" />
				Track queue statistics
			</label>
			<p class="settings-help">Collect local analytics on queue wait times and patterns</p>

			<label class="opt">
				<input type="checkbox" name="debugMode" :checked="settings.debugMode" />
				Debug mode
			</label>
			<p class="settings-help">Show debug information in console (developers only)</p>
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

.button-group {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
	margin-top: 10px;
}

.btn-small {
	padding: 8px 16px;
	font-size: 0.9rem;
	border: none;
	border-radius: 4px;
	background: #555;
	color: white;
	cursor: pointer;
	transition: background 0.2s;
}

.btn-small:hover {
	background: #666;
}

.btn-danger {
	background: #d32f2f;
}

.btn-danger:hover {
	background: #b71c1c;
}
</style>

<script lang="ts">
import {defineComponent, computed} from "vue";
import {useStore} from "../../js/store";

export default defineComponent({
	name: "TrackerFeatures",
	setup() {
		const store = useStore();

		const settings = computed(() => store.state.settings);

		const cacheSize = computed(() => {
			const cache = localStorage.getItem("hostmaskCache");
			if (!cache) return 0;
			try {
				return Object.keys(JSON.parse(cache)).length;
			} catch {
				return 0;
			}
		});

		const exportCache = () => {
			const cache = localStorage.getItem("hostmaskCache");
			if (!cache) {
				alert("No cache to export");
				return;
			}

			const blob = new Blob([cache], {type: "application/json"});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `cleverlounge-hostmask-cache-${Date.now()}.json`;
			a.click();
			URL.revokeObjectURL(url);
		};

		const importCache = () => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = "application/json";
			input.onchange = (e: Event) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (!file) return;

				const reader = new FileReader();
				reader.onload = (event) => {
					try {
						const cache = JSON.parse(event.target?.result as string);
						localStorage.setItem("hostmaskCache", JSON.stringify(cache));
						alert(`✅ Imported ${Object.keys(cache).length} cached users`);
						location.reload();
					} catch (error) {
						alert("❌ Invalid cache file");
					}
				};
				reader.readAsText(file);
			};
			input.click();
		};

		const clearCache = () => {
			if (confirm("Are you sure? This will remove all cached hostmasks.")) {
				localStorage.removeItem("hostmaskCache");
				alert("✅ Cache cleared");
				location.reload();
			}
		};

		return {
			settings,
			cacheSize,
			exportCache,
			importCache,
			clearCache,
		};
	},
});
</script>
