<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Base Repository with common CRUD operations
 * Eliminates code duplication across all repositories
 *
 * @template TModel of Model
 */
abstract class BaseRepository
{
    /** @var TModel */
    public Model $model;

    /**
     * @param  TModel  $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Find a record by ID
     *
     * @param  string|int  $id
     * @return TModel|null
     */
    public function find(string|int $id): ?Model
    {
        return $this->model->newQuery()->find($id);
    }

    /**
     * Get all records
     *
     * @return Collection<int, TModel>
     */
    public function all(): Collection
    {
        return $this->model->newQuery()->get();
    }

    /**
     * Count all records
     *
     * @return int
     */
    public function count(): int
    {
        return $this->model->newQuery()->count();
    }
}
