<?php

namespace App\Services;

use App\Repositories\BaseRepository;
use App\Traits\RedisCache;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Base Service with common business logic operations
 * Handles transactions, logging, and validation
 *
 * @template TModel of Model
 * @template TRepository of BaseRepository
 */
abstract class BaseService
{
    use RedisCache;

    /** @var TRepository */
    protected BaseRepository $repository;

    /**
     * @param  TRepository  $repository
     */
    public function __construct(BaseRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Find a record by ID or throw exception
     *
     * @param  string|int  $id
     * @return TModel
     * @throws ModelNotFoundException
     */
    public function findOrFail(string|int $id): Model
    {
        $model = $this->repository->find($id);

        if (!$model) {
            throw new ModelNotFoundException(
                class_basename($this->repository->model)." not found with ID: {$id}"
            );
        }

        return $model;
    }

    /**
     * Find a record by ID
     *
     * @param  string|int  $id
     * @return TModel|null
     */
    public function find(string|int $id): ?Model
    {
        return $this->repository->find($id);
    }

    /**
     * Get all records
     *
     * @return Collection<int, TModel>
     */
    public function all(): Collection
    {
        return $this->repository->all();
    }

    /**
     * Count all records
     *
     * @return int
     */
    public function count(): int
    {
        return $this->repository->count();
    }
}
