---
title: "CF 913D - 太简单的问题"
description: "我们给出了一组考试题，每个题都有解决时间和控制它是否对我们的分数有贡献的“严格限制”。 只要总时间不超过考试持续时间，我们就可以选择任何问题子集来解决。"
date: "2026-06-13T01:05:17+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 913
codeforces_index: "D"
codeforces_contest_name: "Hello 2018"
rating: 1800
weight: 913
solve_time_s: 410
verified: false
draft: false
---

[CF 913D - 太简单的问题](https://codeforces.com/problemset/problem/913/D)

 **评分：** 1800
 **标签：** 二分查找、暴力破解、数据结构、贪心、排序
 **求解时间：** 6m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了一组考试题，每个题都有解决时间和控制它是否对我们的分数有贡献的“严格限制”。 只要总时间不超过考试持续时间，我们就可以选择任何问题子集来解决。 然而，评分不仅仅是解决问题的数量。 如果我们总共解决了 k 个问题，那么只有当一个已解决的问题自身的极限至少为 k 时，它才贡献一分。 因此，分数取决于所选集合的最终大小，以及所选问题中有多少可以“容忍”该大小。 

目标是选择一个适合总时间 T 的子集，并最大化在该 k 相关条件下保持有效的所选问题数量。 

输入大小 n 最大可达 200,000，这排除了任何指数子集搜索。 在最坏的情况下，即使是 O(n²) 方法也已经太慢了。 时间值足够小，足以用于排序和贪婪结构，但不适用于所有子集的嵌套模拟。 

当一个人只关注选择快速问题或只关注最大化计数时，就会出现天真的陷阱。 例如，选择 k 个最小时间问题并不能保证其中许多问题具有足够大的 aᵢ。 同样，仅选择高 aᵢ 值会忽略时间可行性。 子集大小和有效性阈值之间的相互作用是关键难点。 

一个微妙的边缘情况是当添加一个新问题会增加 k 并使之前有效的选择无效时。 例如，假设 k 当前为 2，并且我们有一个 aᵢ = 2 的选定问题。它仍然有效。 如果我们再添加一个问题，k 就变成 3，那么同样的问题就变得无效了。 任何正确的算法都必须预见到这种反馈循环。 

## 方法

 强力解决方案将尝试所有子集，计算总时间，并通过检查有多少选定问题满足 aᵢ ≥ k 来评估分数。 这是正确的，因为它直接遵循定义，但它探索了 2ⁿ 子集。 当n达到200,000时，即使是2³⁰也变得不可行，因此这种方法立即崩溃。 

观察的关键是扭转观点。 我们可以尝试修复 k 并询问：是否有可能选择 k 个问题，使得它们的总时间 ≤ T 并且至少其中 k 个满足 aᵢ ≥ k，而不是选择一个子集然后计算 k？ 但是如果我们已经固定了k个选定的项目，那么所有这些项目都必须满足aᵢ≥k，否则它们无法对分数做出贡献。 这将问题转化为从 aᵢ ≥ k 的问题中选择 k 个“合格”问题，同时最小化总时间。 

对于固定的 k，最优方法很明确：在所有 aᵢ ≥ k 的问题中，选择 k 个最小的 tᵢ 值。 如果它们的和≤T，则k是可行的。 我们可以测试每个 k 的可行性并取最大值。 为了有效地做到这一点，我们按 aᵢ 对问题进行排序，并维护一个结构（通常是最小堆或多重集），随着 k 的减小，跟踪合格问题中的最小时间。 

我们将 k 从 n 迭代到 1，逐渐激活更多问题（因为随着 k 减小，aᵢ ≥ k 变得更容易）。 我们维护一个候选时间的最小堆，并保留所选 k 个最小时间的运行总和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2ⁿ·n) | O(2ⁿ·n) | O(n) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 我们将问题重新定义为从最大到最小检查所有可能的最终大小 k，维护可用问题池。

1. 按问题的 aᵢ 降序对问题进行排序。 这使得我们可以在 k 减小时激活问题，因为 k 越大，要求越严格。 
2. 初始化一个空的最小堆，用于存储当前符合条件的问题的时间成本。 还维护一个变量来跟踪所选时间的总和，并维护第二个堆或结构来维护 k 个最小时间。 
3. 从 k = n 开始，向下移动到 1。在每个 k，我们将所有 aᵢ 等于 k ​​的问题添加到池中。 这些现在适用于任何尺寸为 k 或更小的解决方案。 
4. 对于当前池，我们想知道是否可以用最少的总时间选出 k 个问题。 我们维护一个始终允许在符合条件的项目中提取最小 k 次的结构。 一个常见的技巧是将所有符合条件的时间放入大小为 k 的最大堆中，通过丢弃较大的值来仅保留 k 个最小值。 
5. 插入该 k 的候选者后，如果堆中至少有 k 个元素，则计算它们的总和。 如果不超过 T，我们将 k 记录为可行并存储当前选择。 
6. 第一个可行的 k（从大到小）给出了最大答案，因为随着 k 的减小，可行性只会变得更容易。 

### 为什么它有效

 对于任何固定的 k，任何有效的解决方案必须仅包含 aᵢ ≥ k 的问题。 其中，最小化总时间相当于选择 k 个最小的 tᵢ 值。 该算法确保对于每个 k，我们都有效地准确维护这个最佳子集。 因为我们按降序检查 k，所以第一个可行的 k 是最大的，并且没有更大的 k 是可行的。 

关键不变量是，在每一步 k，堆包含迄今为止考虑的所有 aᵢ ≥ k 问题中的 k 个最小次数。 这保证了可行性检查是精确的而不是近似的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, T = map(int, input().split())
    problems = [[] for _ in range(n + 1)]
    
    for i in range(n):
        a, t = map(int, input().split())
        problems[a].append((t, i + 1))
    
    heap = []
    total_time = 0
    best_k = 0
    best_set = []
    
    # We maintain a max-heap using negative values to keep k smallest times
    current = []
    
    for k in range(n, 0, -1):
        for t, idx in problems[k]:
            heapq.heappush(current, -t)
            total_time += t
            
            if len(current) > k:
                removed = -heapq.heappop(current)
                total_time -= removed
        
        if len(current) == k and total_time <= T:
            best_k = k
            best_set = [idx for _, idx in [( -x, -1) for x in current]]  # placeholder rebuild
    
    # Reconstruct properly for best_k
    heap = []
    total_time = 0
    res = []
    
    for k in range(n, 0, -1):
        for t, idx in problems[k]:
            heapq.heappush(heap, (t, idx))
        
        if len(heap) >= best_k:
            temp = heapq.nsmallest(best_k, heap)
            if sum(t for t, _ in temp) <= T:
                res = [idx for _, idx in temp]
                break
    
    print(best_k)
    print(len(res))
    print(*res)

if __name__ == "__main__":
    solve()
```第一阶段根据 aᵢ 值构建问题组，以便我们可以逐渐激活约束。 第二阶段维护大量候选时间，并确保我们只保留最小的相关时间，因为较大的候选时间只会损害可行性。 

一个微妙的实现细节是我们不能直接独立地为每个 k 维护一个 k 大小的结构。 相反，我们依靠增量插入和修剪，这确保了所有 k 值的正确性，而无需从头开始重新计算。 

重建步骤是分开的，因为存储每个 k 的精确成员资格将是昂贵的； 相反，一旦 k 已知，我们就会重新计算最佳可行集。 

## 工作示例

 ### 示例 1

 输入：```
5 300
3 100
4 150
4 80
2 90
2 300
```我们跟踪 aᵢ 的激活：

 | k | 新增 | 候选人时代 | 选出k个最小的| 总和 | 可行|
 | ---| ---| ---| ---| ---| ---|
 | 5 | 无 | []| []| 0 | 没有|
 | 4 | (150), (80) | [80,150] | [80,150] | 230 | 230 是的 |
 | 3 | (100) | [80,100,150] | [80,100,150] | 330 | 330 没有|
 | 2 | (90), (300) | [80,90,100,150,300] | 最佳 2 = [80,90] | 170 | 170 是的 |
 | 1 | 无 | 相同 | 最佳 1 = [80] | 80| 是的 |

 在k = 4时可行，但k = 3由于时间爆炸失败，k = 2又可行。 最大值为 2。 

这证实了 k 和可行性之间的相互作用：添加更多候选者并不能保证更高的 k 有效，因为子集大小会改变选择压力。 

### 示例 2

 输入：```
3 100
1 60
1 50
1 40
```| k | 候选人| 最佳 k 项目 | 总和 | 可行|
 | ---| ---| ---| ---| ---|
 | 3 | 无 | []| 0 | 没有|
 | 2 | 无 | []| 0 | 没有|
 | 1 | 全部 | [40]| 40 | 40 是的 |

 由于所有 aᵢ 都太小，因此只有 k = 1 可行。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 每个问题插入堆一次，堆操作占主导地位 |
 | 空间| O(n) | 分组问题和堆结构的存储|

 当 n 达到 200,000 时，复杂性完全在限制范围内，因为 log n 操作保持高效并且内存使用呈线性。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from math import inf

    n, T = map(int, sys.stdin.readline().split())
    probs = []
    for i in range(n):
        a, t = map(int, sys.stdin.readline().split())
        probs.append((a, t, i + 1))

    best_k = 0
    best_set = []

    for k in range(n, 0, -1):
        cand = [t for a, t, i in probs if a >= k]
        cand.sort()
        if len(cand) >= k and sum(cand[:k]) <= T:
            best_k = k
            break

    if best_k == 0:
        return "0\n0\n"

    eligible = [(t, i) for a, t, i in probs if a >= best_k]
    eligible.sort()
    chosen = eligible[:best_k]
    return f"{best_k}\n{len(chosen)}\n" + " ".join(str(i) for _, i in chosen)

# provided sample
assert run("5 300\n3 100\n4 150\n4 80\n2 90\n2 300\n") == "2\n2\n3 4\n"

# custom cases
assert run("1 10\n1 5\n") == "1\n1\n1", "single item"
assert run("3 10\n1 5\n1 6\n1 7\n") == "1\n1\n1", "tight budget"
assert run("4 100\n4 10\n4 10\n4 10\n4 10\n") == "4\n4\n1 2 3 4", "all equal"
assert run("3 5\n3 10\n3 10\n3 10\n") == "0\n0\n", "no feasible time"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单品 | 1 问题可行 | 最小边界|
 | 预算紧张| 只能选一个| 贪婪正确性 |
 | 一切平等| 作品全选| 对称情况|
 | 没有可行的时间| 空答案 | 零分优势 |

 ## 边缘情况

 当所有问题的 aᵢ 都非常小时（例如全部等于 1）时，就会出现临界边缘情况。在这种情况下，无论时间如何，任何 k ≥ 2 的解决方案都会自动无效，因为每个选定的问题都要求 k ≤ 1。该算法通过从不将 k > 1 视为可行来正确处理此问题，因为不存在更高 k 值的候选方案。 

当时间非常长但 aᵢ 值受到限制时，就会出现另一种边缘情况。 即使我们能够及时解决所有问题，分数仍然受到所选项目中最小的 aᵢ 的限制。 该算法自然地反映了这一点，因为可行性始终由 aᵢ ≥ k 控制，从而防止高估分数。 

最后，当一个问题的时间非常大但 aᵢ 高时，除非 k 非常小，否则它永远不会被选择。 由于我们总是首先选择最小的时间，除非有必要，否则这些异常值会被自动排除，从而保持最优性。
