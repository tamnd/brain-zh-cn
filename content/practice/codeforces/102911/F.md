---
title: "CF 102911F - 民间传说"
description: "We are given a sequence of distinct items, each item originally sitting in a fixed position from 1 to N. We must rearrange them into a new ordering."
date: "2026-07-04T08:05:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102911
codeforces_index: "F"
codeforces_contest_name: "2021 Ateneo de Manila Senior High School Dagitab Programming Contest (Mirror)"
rating: 0
weight: 102911
solve_time_s: 46
verified: true
draft: false
---

[CF 102911F - 民间传说](https://codeforces.com/problemset/problem/102911/F)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一系列不同的项目，每个项目最初位于从 1 到 N 的固定位置。我们必须将它们重新排列成新的顺序。 The constraint is positional: if an item starts at position x and ends at position y, then the absolute distance |x − y| 必须至少为 K。换句话说，任何项目都不允许停留在其原始位置附近，它必须在最终排列中移动至少 K 步。 

The task is to construct any valid permutation satisfying this rule, or determine that no such permutation exists.

 The input is a single sequence of song names, but these names are only labels for distinct elements. The real structure is the index positions 1 through N. The output is either a valid reordered sequence or a statement that it cannot be done.

 The constraint N up to 10^5 implies we need a linear or near-linear construction. Any solution that tries to test permutations or search configurations is immediately ruled out because N! or even N^2 approaches are far beyond feasible limits. 唯一可行的解​​决方案是直接的建设性排列或贪婪移位。 

关键的边缘情况来自小 N 或大 K。如果 K 相对于 N 较大，则移动变得不可能。 

例如，如果 N = 4 并且 K = 3，则位置 1 至少需要移动到位置 4，但位置 4 最多需要移动到位置 1，从而产生无法同时解决所有元素的冲突。 像将所有内容移动 K 个位置这样的天真的尝试会失败，因为包裹会产生很小的距离。 

另一个微妙的边缘情况是当 K = 0 时。在这种情况下，原始顺序已经满足条件，因为 |x − x| = 0 是允许的。 

## 方法

 强力解释将尝试生成所有排列并检查每个元素是否满足距离条件。 这原则上是正确的，因为它直接执行规则，但需要检查 N！ 排列，并且每次检查的成本为 O(N)，使得超过 N = 8 左右时完全不可行。 

一种更结构化的强力改进是尝试逐个位置交换或回溯放置位置，确保每次分配都遵守已放置元素的距离约束。 这种情况仍然呈爆炸式增长，因为早期的布局严重限制了后来的布局，而且分支因素仍然很大。 

关键的观察结果是，约束是纯粹位置和对称的：每个索引 i 禁止将其元素放置在区间 [i − (K − 1), i + (K − 1)] 中。 这表明我们不应该进行搜索，而应该直接构造一个排列，以统一的方式将每个索引移出其禁区。 

A natural attempt is a cyclic shift. 如果我们将每个元素从 i 移动到 i + K，环绕，那么每个元素在索引空间中正好向前移动 K 个位置。 然而，环绕引入了可能小于 K 的第二个位移。唯一不打破约束的时间是环绕距离仍至少为 K 时，这恰好发生在 N − K ≥ K 或等效的 N ≥ 2K 时。 

当 N ≥ 2K 时，我们可以安全地将数组分成大小为 K 和 N − K 的两部分，并将整个数组旋转 K 个位置。 这确保每个元素向前或向后移动至少 K。 

如果 N < 2K，则任何尝试都必定会失败，因为可用位置太紧凑。 每个元素必须避免其周围有大小为 2K − 1 的中心窗口，但可用位置的总数不足以同时满足所有约束。 

| 方法| 时间复杂度| 空间复杂度| 判决|
 | ---| ---| ---| ---|
 | Brute Force permutations | O(N!·N) | O(N!·N) | O(N) | 太慢了 |
 | Cyclic shift construction | O(N) | O(N) | 已接受 |

 ## 算法演练

The optimal construction depends on whether we can safely rotate the array by K positions without violating the distance constraint.

 1. Check the value of K. If K is zero, the original order already satisfies the condition, so we can output the array directly. This avoids unnecessary transformations and handles the degenerate case cleanly.
 2. Check whether N is less than 2K. If it is, immediately conclude that no valid permutation exists. This follows from the fact that a valid placement would require every element to be mapped outside a forbidden interval of size 2K − 1, which cannot be accommodated in a line of length N.
3. When N is at least 2K, construct a new permutation by shifting each index forward by K positions modulo N. Concretely, for each i from 1 to N, we assign it to position (i + K), wrapping around to the start when we exceed N.
4. Output the resulting sequence in this new order.

 The reason this construction is chosen is that it creates a uniform displacement pattern. Every element is moved exactly K positions forward in a circular sense, and the size condition N ≥ 2K guarantees that wrapping does not produce a shortcut distance smaller than K.

 ### 为什么它有效

 The algorithm maintains the invariant that each element originally at position i is moved to a position whose cyclic distance from i is exactly K forward. When N ≥ 2K, this cyclic displacement corresponds to a linear displacement of either K or N − K, and both are at least K. Therefore every element satisfies |i − p[i]| ≥ K, ensuring the constraint holds globally. Since every position is used exactly once, the result is a valid permutation.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    arr = input().split()

    if k == 0:
        print("YES")
        print(*arr)
        return

    if n < 2 * k:
        print("NO")
        return

    res = [None] * n

    for i in range(n):
        res[(i + k) % n] = arr[i]

    print("YES")
    print(*res)

if __name__ == "__main__":
    solve()
```The implementation directly encodes the cyclic shift described in the algorithm. 数组`res`表示最终的排序，每个原始索引 i 被放置在位置 (i + k) mod n 处。 The modulo operation is the only place where wrap-around is handled, and correctness relies on the earlier check ensuring that this wrap-around does not produce displacements smaller than K.

 一个常见的错误是忘记当 N < 2K 时相同的循环移位会失败。 如果没有该保护，从末尾换行到开头的元素可能会过于接近其原始位置。 

## 工作示例

 考虑输入为 N = 4 且 K = 1 的情况`[a, b, c, d]`。 

我们将每个元素移动 1 个位置：

 | 我| original position | 新位置 (i+1 mod 4) |
 | ---| ---| ---|
 | 1 | 一个 | 2 |
 | 2 | b | 3 |
 | 3 | c | 4 |
 | 4 | d | 1 |

 得到的排列是`[d, a, b, c]`。 在循环意义上，每个元素恰好移动一个位置，并且由于 K = 1，所以这是有效的。 

现在考虑 N = 6 和 K = 2 输入`[1, 2, 3, 4, 5, 6]`。 

| 我| original position | new position |
 | ---| ---| ---|
 | 1 | 1 | 3 |
 | 2 | 2 | 4 |
 | 3 | 3 | 5 |
 | 4 | 4 | 6 |
 | 5 | 5 | 1 |
 | 6 | 6 | 2 |

 结果是`[5, 6, 1, 2, 3, 4]`。 Every element moved either 2 or 4 positions away from its original index, and both are at least K.

These traces show that the shift preserves a uniform displacement pattern and avoids any element staying within the forbidden neighborhood.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N) | Each element is placed exactly once during construction |
 | 空间| O(N) | We store the resulting permutation array |

 The solution runs comfortably within constraints because it performs only a single linear pass over the input and output arrays. Even for N = 10^5, this is well within typical limits.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out
    solve()
    sys.stdout = backup
    return out.getvalue().strip()

# K = 0 case
assert run("3 0\na b c\n") == "YES\na b c"

# small impossible case
assert run("4 3\na b c d\n") == "NO"

# basic valid shift
assert run("4 1\na b c d\n") == "YES\nd a b c"

# N = 6, K = 2
assert run("6 2\n1 2 3 4 5 6\n") == "YES\n5 6 1 2 3 4"

# boundary N = 1, K = 0
assert run("1 0\nx\n") == "YES\nx"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | N=1, K=0 | YES x | 最小案例|
 | N=4, K=3 | 否 | 不可能的状态 N < 2K |
 | N=4, K=1 | cyclic shift | basic correctness |
 | N=6, K=2 | shifted permutation | multi-step validity |

 ## 边缘情况

 When K = 0, the constraint imposes no restriction. The algorithm immediately returns the original array, which trivially satisfies the condition since every element stays at distance 0 from its original position.

 When N < 2K, for example N = 5, K = 3, any attempted shift causes wrap-around collisions. An element moved from position 4 to 1 has distance 3, but elements near the boundary cannot all be placed without violating the constraint, and the construction is impossible. The algorithm correctly detects this and outputs NO before attempting any permutation.

 When N ≥ 2K, the cyclic shift never maps an element into the forbidden interval around its original position, and every element ends up at a safe distance, confirming the correctness of the construction in all feasible cases.
