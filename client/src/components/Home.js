import React from 'react';

import '../App.css';

function Home() {
  return (
    <div>
      <h2>This is the Home page</h2>
      <form class="row domain-search bg-pblue">
        <input type="submit" value="All" class="btn btn-primary"/>
        <input type="search" class="form-control"/>
        <span class="input-group-addon"><input type="submit" value="Search" class="btn btn-primary"/></span>
      </form>
    </div>
  );
}

export default Home;