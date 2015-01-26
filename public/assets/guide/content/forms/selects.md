---
name: Selection Fields
---

---html|push|render---

<select name="selection">
	<option value="1">Lorem</option>
	<option value="2">Ipsum</option>
	<option value="3">Dolor</option>
</select>
<label for="multi-selection">Multiple Selection</label>
<select name="multi-selection" id="multi-selection" multiple>
	<optgroup label="Grouping">
		<option value="1">Lorem</option>
		<option value="2">Ipsum</option>
		<option value="3">Dolor</option>
	</optgroup>
</select>
<div class="inline-field">
	<label for="inline-selection">Inline Selection</label>
	<select name="inline-selection" id="inline-selection" multiple>
		<option value="1">Lorem</option>
		<option value="2">Ipsum</option>
		<option value="3">Dolor</option>
	</select>
</div>
<div class="inline-field">
	<input type="checkbox" name="checkbox" id="checkbox">
	<label for="checkbox">Lorem ipsum dolor sit amet</label>
</div>
<div class="inline-field">
	<input type="radio" name="radio" id="radio">
	<label for="radio">Lorem ipsum dolor sit amet</label>
</div>
<div class="inline-field">
	<input type="radio" name="radio" id="radio2">
	<label for="radio2">Lorem ipsum dolor sit amet</label>
</div>