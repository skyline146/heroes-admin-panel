import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { heroesDeleteItem, fetchHeroes, filteredHeroesSelector } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './HeroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния !DONE!
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE !DONE!

const HeroesList = () => {

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    dispatch('LOG_NUMBER');

    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(res => console.log(res, 'Deleted'))
            .then(dispatch(heroesDeleteItem(id)))
            .catch(err => console.error(err));
            // eslint-disable-next-line
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h2 className="text-center mt-5 font-weight-bold text-danger text-uppercase">Ошибка загрузки</h2>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={300}
                    classNames='hero-item'    
                >
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition
                    key={id}
                    timeout={300}
                    classNames='hero-item'
                >
                    <HeroesListItem onDelete={() => onDelete(id)} {...props}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    console.log(elements);
    return (
        <TransitionGroup component='ul'>
            {elements}
        </TransitionGroup>
        
    )
}

export default HeroesList;