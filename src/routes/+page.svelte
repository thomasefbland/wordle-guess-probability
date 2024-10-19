<script lang="ts">
	import { Delete, X } from "lucide-svelte";
	import { SvelteMap } from "svelte/reactivity";

	// import total_vocabulary_raw from "$lib/complete_vocabulary.txt?raw";
	// let total_vocabulary = total_vocabulary_raw.toUpperCase().split("\n").sort();
	import { vocabulary } from "$lib/2024-10-18";
	let total_vocabulary = vocabulary.map((str) => str.toUpperCase()).sort();

	type RowNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

	// let answer = $state<string | null>(null);
	let showing_results = $state(false);

	let row_inputs = new SvelteMap<RowNumber, string>([
		[0, ""],
		[1, ""],
		[2, ""],
		[3, ""],
		[4, ""],
		[5, ""],
		[6, ""],
	]);
	let current_row_number = $state<RowNumber>(0);
	let current_row_value = $derived(row_inputs.get(current_row_number)!);

	const keyboard_rows = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Z", "X", "C", "V", "B", "N", "M"],
	];

	function handleLetterKey(letter: string) {
		if (current_row_value.length === 5) return;
		showing_results = false;
		row_inputs.set(current_row_number, current_row_value + letter);
		if (current_row_value.length === 5 && current_row_number !== 6) current_row_number += 1;
	}
	function handleBackspace() {
		showing_results = false;
		if (current_row_value.length === 0 && current_row_number === 0) return;
		if (current_row_value.length !== 0) {
			row_inputs.set(current_row_number, current_row_value.substring(0, current_row_value.length - 1));
		} else {
			current_row_number -= 1;
		}
	}
	function handleEnter() {
		for (let row_number = 1 as RowNumber; row_number < 7; row_number++) {
			const row_contents_length = row_inputs.get(row_number)!.length;
			if (row_contents_length === 5) {
				getValidWords(row_number);
			}
		}
		showing_results = true;
	}

	const valid_keys = [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"ARROWUP",
		"ARROWDOWN",
		"ENTER",
		"BACKSPACE",
		"Q",
		"W",
		"E",
		"R",
		"T",
		"Y",
		"U",
		"I",
		"O",
		"P",
		"A",
		"S",
		"D",
		"F",
		"G",
		"H",
		"J",
		"K",
		"L",
		"Z",
		"X",
		"C",
		"V",
		"B",
		"N",
		"M",
	];
	// Keyboard events
	function handleKeyDown(e: KeyboardEvent) {
		const key_in_uppercase = e.key.toUpperCase();
		if (valid_keys.includes(key_in_uppercase) == false) return;
		if ($open) $open = false;
		if (key_in_uppercase === "ENTER") {
			if (isEnterDisabled()) return;
			handleEnter();
		} else if (key_in_uppercase === "BACKSPACE") {
			handleBackspace();
		} else if (key_in_uppercase === "ARROWUP") {
			if (current_row_number === 0) return;
			current_row_number -= 1;
		} else if (key_in_uppercase === "ARROWDOWN") {
			if (current_row_number === 6) return;
			current_row_number += 1;
		} else if (
			// @ts-ignore isNaN can take non numbers just fine
			isNaN(key_in_uppercase) === false
		) {
			current_row_number = (parseInt(key_in_uppercase) - 1) as RowNumber;
		} else handleLetterKey(key_in_uppercase);
	}

	function selectRow(i: number) {
		current_row_number = i as RowNumber;
	}

	function checkInvalid(i: RowNumber): boolean {
		const letters = row_inputs.get(i)!;

		if (letters.length === 5 && total_vocabulary.includes(letters) == false) return true;

		// Check for non-empty rows in front if row is not full
		if (letters.length < 5) {
			for (let j = (i + 1) as RowNumber; j < 7; j++) {
				if (row_inputs.get(j)!.length > 0) return true;
			}
			// If we find no non-empty rows in front, but we have letters in our row without being full
			if (letters.length > 0) return true;
		}
		return false;
	}

	function _check() {
		for (let i = 0; i < 7; i++) {
			if (checkInvalid(i as RowNumber)) return true;
		}
		return false;
	}
	function isEnterDisabled(): boolean {
		return showing_results || row_inputs.get(0)!.length < 5 || row_inputs.get(1)!.length < 5 || _check();
	}

	let row_character_colors = new SvelteMap<RowNumber, Array<string>>([
		[0, ["#41753b", "#41753b", "#41753b", "#41753b", "#41753b"]],
		[1, []],
		[2, []],
		[3, []],
		[4, []],
		[5, []],
		[6, []],
	]);
	let valid_words_at_row = new SvelteMap<RowNumber, Array<string>>([
		[0, total_vocabulary],
		[1, total_vocabulary.slice()],
		[2, total_vocabulary.slice()],
		[3, total_vocabulary.slice()],
		[4, total_vocabulary.slice()],
		[5, total_vocabulary.slice()],
		[6, total_vocabulary.slice()],
	]);

	let green_letters = $state<string>("");
	let yellow_letters = $state<string>("");
	let wrong_letters = $state<string>("");

	function getValidWords(row_number: RowNumber) {
		console.log(row_number);
		if (row_number === 0) return;

		const word_pool = valid_words_at_row.get(row_number)!.slice();
		const answer = row_inputs.get(0)!;
		const guess = row_inputs.get(row_number)!;
		const colors = row_character_colors.get(row_number)!;

		const x = answer.split("").map((char, index) => (guess[index] === char ? "1" : char));
		const y = guess.split("").map((char, index) => (answer[index] === char ? "2" : char));

		const guess_wrong_letters: Array<string> = [];

		const valid_characters_at_positions: Array<string> = [];
		for (let character_position = 0; character_position < 5; character_position++) {
			if (guess[character_position] !== answer[character_position]) valid_characters_at_positions.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
			else valid_characters_at_positions[character_position] = guess[character_position];
		}

		for (let character_position = 0; character_position < 5; character_position++) {
			const guess_character = guess[character_position];
			if (guess_character === answer[character_position]) {
				colors[character_position] = "#6ca965";
				if (green_letters.indexOf(guess_character) === -1) green_letters += guess_character;
			} else {
				const index = x.indexOf(y[character_position]);
				if (index > -1) {
					x[index] = "3";
					colors[character_position] = "#c8b653";
					valid_characters_at_positions[character_position] = valid_characters_at_positions[character_position].replace(
						guess_character,
						"",
					);
					if (yellow_letters.indexOf(guess_character) === -1) {
						yellow_letters += guess_character;
					}
				} else {
					colors[character_position] = "#787c7f";
					if (answer.indexOf(guess_character) == -1 && guess_wrong_letters.indexOf(guess_character) === -1)
						guess_wrong_letters.push(guess_character);
					if (wrong_letters.indexOf(guess_character) === -1) {
						wrong_letters += guess_character;
					} else
						valid_characters_at_positions[character_position] = valid_characters_at_positions[character_position].replace(
							guess_character,
							"",
						);
				}
			}
		}

		for (const wrong_letter of guess_wrong_letters) {
			for (let character_position = 0; character_position < 5; character_position++) {
				valid_characters_at_positions[character_position] = valid_characters_at_positions[character_position].replace(
					wrong_letter,
					"",
				);
			}
		}

		valid_words_at_row.set(
			(row_number + 1) as RowNumber,
			word_pool
				.filter((word) => {
					for (let i = 0; i < 5; i++) {
						if (valid_characters_at_positions[i].indexOf(word[i]) === -1) return false;
					}
					return true;
				})
				.slice(),
		);
	}

	import { createDialog, melt } from "@melt-ui/svelte";
	const {
		elements: { overlay, content, close, portalled },
		states: { open },
	} = createDialog({
		forceVisible: true,
		preventScroll: true,
	});
	let scrollable_element = $state<HTMLElement>();
	let end_index = $state(100);
	$effect(() => {
		if (scrollable_element) {
			scrollable_element.addEventListener("scroll", ({ target }) => {
				// @ts-ignore
				if (target.scrollTop / (target.scrollHeight - target.clientHeight) > 0.95) {
					end_index += 50;
				}
			});
		}
	});
</script>

<h1 class="mb-2 pt-4 text-center text-2xl md:mb-8 md:text-4xl">
	Wordle Guess
	<br class="hidden md:block" />
	Probability
</h1>

<div class="mx-auto w-fit">
	{#each row_inputs as row_input, i}
		{@const letters = row_input[1].split("")}

		{#if i === 0}
			<div class="instructions">Enter the correct answer</div>
		{/if}
		<div class="guess-row-wrapper">
			<!-- svelte-ignore a11y_autofocus -->
			<button
				class="guess-row"
				class:selected={current_row_number === i}
				class:invalid={checkInvalid(i as RowNumber)}
				onclick={() => selectRow(i)}
				onfocus={() => selectRow(i)}
				autofocus={i === 0}
			>
				{#each { length: 5 } as _, j}
					{@const row_content_length = row_inputs.get(i as RowNumber)!.length}
					{@const color = i > 0 ? showing_results && row_inputs.get(i as RowNumber)!.length === 5 : row_content_length > j}
					<div
						class="guess-letter"
						class:filled={row_content_length > j}
						class:colored={color}
						style="background-color:{color ? row_character_colors.get(i as RowNumber)![j] : ''}"
					>
						{letters[j]}
					</div>
				{/each}
			</button>
			{#if i > 0 && showing_results && row_inputs.get((i - 1) as RowNumber)!.length > 0}
				<button
					class="valid-guess-count"
					onclick={() => {
						selectRow(i);
						$open = true;
					}}
				>
					<div>{valid_words_at_row.get(i as RowNumber)!.length}</div>
					<div>/{valid_words_at_row.get((i - 1) as RowNumber)!.length}</div>
				</button>
			{/if}
		</div>

		{#if i === 0}
			<hr class="border-t-2 border-gray-700" />
			<div class="instructions">Enter your guesses...</div>
		{/if}
	{/each}
</div>

{#if $open}
	<div use:melt={$portalled}>
		<div use:melt={$overlay} class="fixed inset-0 z-50 bg-white/95"></div>
		<div use:melt={$content} use:melt={$close} class="dialog-content">
			<div class="heading">
				{valid_words_at_row.get(current_row_number)!.length}/{valid_words_at_row.get((current_row_number - 1) as RowNumber)!.length}
			</div>
			<button use:melt={$close} class="absolute right-5 top-5"><X /></button>
			<div class="scrollable" bind:this={scrollable_element}>
				{#each { length: 100 > valid_words_at_row.get(current_row_number)!.length ? valid_words_at_row.get(current_row_number)!.length : 100 + end_index } as _, i}
					{@const word = valid_words_at_row.get(current_row_number)![i]}
					<div>{word}</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<svelte:window onkeydown={handleKeyDown} />

<div class="keyboard">
	{#each keyboard_rows as keyboard_row, i}
		<div class="keyboard-row">
			{#if i === 2}
				<button class="keyboard-row-key special" disabled={isEnterDisabled()} onclick={handleEnter}>ENTER</button>
			{/if}
			{#each keyboard_row as key}
				{@const color = green_letters.includes(key)
					? "#6ca965"
					: yellow_letters.includes(key)
						? "#c8b653"
						: wrong_letters.includes(key)
							? "#787c7f"
							: false}
				<button
					class="keyboard-row-key{color ? ' text-white' : ''}"
					style="background-color:{color}"
					onclick={() => handleLetterKey(key)}
				>
					{key}
				</button>
			{/each}
			{#if i === 2}
				<button class="keyboard-row-key special" onclick={handleBackspace}>
					<Delete class="h-1/2 md:h-full" />
				</button>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.instructions {
		@apply my-2 md:text-lg;
	}
	hr {
		@apply mb-2 mt-0.5 md:mb-4 md:mt-3;
	}
	.guess-row-wrapper {
		@apply relative;
	}
	.guess-row {
		@apply flex;
		@apply rounded-sm;

		@apply gap-x-1.5 p-0.5 md:gap-x-3 md:p-1.5;

		@apply my-2;

		&.selected,
		&.invalid {
			@apply ring;
		}

		&.invalid {
			@apply ring-red-500/50;
		}
		&.selected {
			@apply ring-blue-500/60;
		}
	}
	.guess-letter {
		@apply size-10 md:size-14;
		@apply outline outline-2 outline-gray-300;

		@apply text-xl md:text-2xl;
		@apply flex items-center justify-center;

		&.filled {
			@apply outline-gray-500;
		}
		&.colored {
			@apply outline-none;
			@apply text-white;
		}
	}
	.valid-guess-count {
		@apply absolute top-1/2 -translate-y-1/2 translate-x-full;
		@apply -right-2 md:-right-4;
		@apply text-[10px] md:text-base;

		@apply flex flex-col md:flex-row;
	}
	.dialog-content {
		@apply absolute top-0 z-50;

		@apply px-2 py-8;

		@apply h-screen w-full text-center;

		@apply flex flex-col;

		.heading {
			@apply mb-5 text-lg md:mb-8 md:text-2xl;
		}

		.scrollable {
			@apply overflow-y-scroll;
			@apply md:text-3xl;

			div {
				@apply mb-2 md:mb-4;

				&:nth-child(even) {
					@apply text-gray-700;
				}
			}
		}
	}

	.keyboard {
		@apply flex flex-col;
		@apply items-center;
		@apply gap-y-1 md:gap-y-1.5;

		@apply mt-4 md:mt-8;
	}
	.keyboard-row {
		@apply flex;
		@apply gap-x-1;
	}
	.keyboard-row-key {
		@apply h-10 w-8 md:h-14 md:w-10;
		@apply flex items-center justify-center;

		@apply rounded;

		@apply bg-gray-300;

		@apply text-base md:text-xl;

		&.special {
			@apply w-12 md:w-16;

			@apply text-[10px] md:text-xs;
		}

		&:disabled {
			@apply opacity-30;
			@apply cursor-not-allowed;
		}
	}
</style>
