import React, { useEffect, useState } from 'react';
import './App.css'
import { Card, Grid, Icon, Image, Menu, Input, Feed } from 'semantic-ui-react'

function Dashboard() {
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorted, setSorted] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [page1, setPage1] = useState(1);
  const [loadDeatils, setLoadDetails] = useState(false);
  const [data, setData] = useState([])

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1N2RlNDdmYmM2YWIyMzJhMDcxYTQyZDk2MmYyNjM5YiIsInN1YiI6IjY0ZGM0ZjVjMzcxMDk3MDBmZmI4MzUwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EPsBo1d29O4UiZ1lWGxx9FjtGGIyY_1qjoDVk2bqtXk'
    }
  };

  const fetchData = () => {
    fetch(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`, options)
      .then(response => response.json())
      .then(response => {
        setMoviesList(prevItems => [...prevItems, ...response.results])
        setIsLoading(false);
      }
      )
      .catch(err => console.error(err));
  }

  const handelInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setIsLoading(true);
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, []);

  const updateSearchQuery = (e) => {
    setSearchQuery(e.target.value)
  }

  const triggerSearch = () => {
    if (searchQuery.length > 0) {
      // fetch(`https://api.themoviedb.org/3/search/collection?query=${searchQuery}&include_adult=false&language=en-US&page=${page1}`, options)
      fetch(`https://api.themoviedb.org/3/search/multi?query=${searchQuery}&include_adult=false&language=en-US&page=${page1}`, options)
        .then(response => response.json())
        .then(response => {
          setSorted(prevItems => [...prevItems, ...response.results])
          setIsLoading(false);
        })
        .catch(err => console.error(err));
    }
  }

  const KeyDownHandler = (e) => {
    if (e.keyCode === 13) {
      triggerSearch()
    }
  }

  const cardClickHandle = (c) => {
    setLoadDetails(true)
    setData([c])
  }

  const cardClickHandle1 = (c) => {
    setSearchQuery('')
    setLoadDetails(true)
    setData([c])
  }

  const handleHome = () => {
    setLoadDetails(false)
    setSearchQuery('')
    setData([])
  }

  useEffect(() => {
    fetchData();
    triggerSearch();
  }, [page, page1]);

  return (
    <div className='mar-pad'>
      {!loadDeatils && <Grid>
        <Grid.Row className="bg-body-tertiary navHeader">
          <Grid.Column width={15}>
            <Menu.Item>
              <Input size='mini' type='text' value={searchQuery} onInput={updateSearchQuery}
                className='icon' icon={<Icon name='search' link onClick={() => triggerSearch()} />}
                onKeyDown={KeyDownHandler} placeholder='Search...' />
            </Menu.Item>
          </Grid.Column>
          <Grid.Column style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            {/* <Icon name='home' size='large' link onClick={() => setLoadDetails(false)} /> */}
            {searchQuery.length > 0 ? <Icon name='home' size='large' link onClick={() => setLoadDetails(true)} /> : <Icon name='home' size='large' />}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ display: 'flex', justifyContent: 'center', margin: '20px' }} >
          {searchQuery.length > 0 ?
            sorted.map((c, i, { poster_path }) =>
              <Grid.Column key={c.id + i} width={3} style={{ marginBottom: '10px' }}>
                <Card onClick={() => cardClickHandle1(c)}>
                  <Image height='100px'
                    width='150px'
                    style={{ background: '#DFDFDF' }}
                    src={`${poster_path}`} wrapped ui={false} />
                  <Card.Content>
                    <Card.Header >{c.original_title}</Card.Header>
                    <Card.Header ><Icon name='star' size='small' color='yellow' />{c.popularity}</Card.Header >
                    <Card.Description >
                      {c?.overview && c?.overview !== "" && c?.overview.length <= 21 ? c?.overview : c.overview?.substring(0, 20) + '...'}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            )
            : <>
              {moviesList.map((c, i, { poster_path }) =>
                <Grid.Column key={c.id + i} width={3} style={{ marginBottom: '10px' }}>
                  <Card onClick={() => cardClickHandle(c)}>
                    <Image height='100px'
                      width='150px'
                      style={{ background: '#DFDFDF' }}
                      src={`${poster_path}`} wrapped ui={false} />
                    <Card.Content>
                      <Card.Header>{c.original_title}<Icon name='star' size='small' color='yellow' style={{ marginLeft: '2px' }} />{c.vote_average}</Card.Header>
                      {/* <Card.Header><Icon name='star' size='small' color='yellow' />{c.vote_average}</Card.Header > */}
                      <Card.Description title={c?.overview}>
                        {c?.overview && c?.overview.length <= 21 ? c?.overview : c?.overview.substring(0, 20) + '...'}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              )
              }
            </>
          }
        </Grid.Row>
      </Grid>
      }

      {loadDeatils && <Grid>
        <Grid.Row className="bg-body-tertiary navHeader ht">
          <Grid.Column width={15} style={{ fontWeight: 'bold', fontSize: '20px' }}>
            Movie Details
          </Grid.Column>
          <Grid.Column style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <Icon name='home' size='large' link onClick={handleHome} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ display: 'flex', justifyContent: 'start', margin: '20px' }} >
          {data.map((c, i, { poster_path }) =>
            <>
              <Grid.Column Column key={c.id + i} width={16}>
                <Feed>
                  <Feed.Event>
                    <Feed.Label height='30%'
                      width='50%'
                      style={{ background: '#DFDFDF' }} image={`${poster_path}`} />
                    <Feed.Content>
                      <Feed.Summary style={{ fontSize: '22px' }}>{c.original_title} <Icon name='star' size='small' color='yellow' style={{ marginLeft: '5px' }} />{c.vote_average}</Feed.Summary>
                      <br />
                      <div >
                        <span> Year : {c.release_date} </span> |  <span> Length : </span> |  <span> Director : </span>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        Cast :
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        Description : {c?.overview}
                      </div>
                    </Feed.Content>
                  </Feed.Event>
                </Feed>
              </Grid.Column>
            </>
          )}
        </Grid.Row>
      </Grid>
      }
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default Dashboard;