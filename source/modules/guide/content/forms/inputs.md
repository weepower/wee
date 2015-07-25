---
name: Input Fields
---

---html|render---

<input type="email" name="name" placeholder="Email Address" required>
<div class="inline-field">
	<label for="name">Full Name</label>
	<input type="text" name="name" placeholder="Your Name" id="name" disabled>
</div>
<label for="message">Message</label>
<textarea name="textarea" id="message" required></textarea>
<div class="inline-field">
	<label for="inline">Inline Message</label>
	<textarea name="inline" id="inline" placeholder="Short message here..."></textarea>
</div>