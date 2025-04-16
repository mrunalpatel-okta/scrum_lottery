<script>
  let nameInput = "";
  let names = [];
  let pickedName = "";

  const params = new URLSearchParams(window.location.search);
  const namesParam = params.get("names");

  if (namesParam) {
    names = namesParam.split(",").map(name => name.trim()).filter(Boolean);
  }

  function addName() {
    if (nameInput.trim() !== "") {
      names = [...names, nameInput.trim()];
      nameInput = "";
    }
  }

  function pickRandomName() {
    if (names.length > 0) {
      const randomIndex = Math.floor(Math.random() * names.length);
      pickedName = names[randomIndex];
    }
  }

  function clearList() {
    names = [];
    pickedName = "";
  }
</script>

<style>
  body {
    font-family: sans-serif;
  }
  .container {
    max-width: 400px;
    margin: auto;
    text-align: center;
  }
  input {
    padding: 0.5rem;
    width: 70%;
    margin-right: 0.5rem;
  }
  button {
    padding: 0.5rem 1rem;
    margin: 0.5rem;
  }
  ul {
    list-style-type: none;
    margin: 15px;
    padding: 0;
  }
  li {
    margin: 15px;
    padding: 0;
  }
</style>

<div class="container">
  <h1>🎲 Random Name Picker</h1>

  <input type="text" bind:value={nameInput} placeholder="Enter a name" />
  <button on:click={addName}>Add Name</button>

  {#if names.length > 0}
    <h3>Names:</h3>
    <ul>
      {#each names as name}
        <li>{name}</li>
      {/each}
    </ul>

    <button on:click={pickRandomName}>Pick Random Name</button>
    <button on:click={clearList}>Clear List</button>

    {#if pickedName}
      <h2>🎉 Picked: {pickedName}</h2>
    {/if}
  {:else}
    <p>No names added yet.</p>
  {/if}
</div>