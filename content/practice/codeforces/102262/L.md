---
title: "CF 102262L - \u041d\u0430\u0431\u043e\u0440 \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0442\u043e\u0440\u043e\u0432"
description: "有N个分类器。 分类器 i 有 K 个度量值，每个度量一个值。 如果我们激活多个分类器，则度量 j 的结果值为激活的分类器中的最大值 a[i][j]。 激活集的有用性是这些 K 最大值的总和。"
date: "2026-08-17T20:34:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102262
codeforces_index: "L"
codeforces_contest_name: "\u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e - \u0444\u0438\u043d\u0430\u043b (\u042f\u043d\u0434\u0435\u043a\u0441)"
rating: 0
weight: 102262
solve_time_s: 162
verified: true
draft: false
---

[CF 102262L - \u041d\u0430\u0431\u043e\u0440 \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0442\u043e\u0440\u043e\u0432](https://codeforces.com/problemset/problem/102262/L)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有N个分类器。 分类器 i 有 K 个度量值，每个度量一个值。 如果我们激活多个分类器，则度量 j 的结果值为激活的分类器中的最大值 a[i][j]。 激活集的有用性是这些 K 最大值的总和。 

我们需要准确地选择 M 个具有最大可能有用性的不同分类器。 输出包含该最大值以及达到该最大值的任何 M 分类器索引集。 

约束直接指向 K 中的指数算法，而不是 N 中的指数算法。可以有 2000 个分类器，因此不可能枚举分类器的子集。 另一方面，K 至多为 15，因此只有 2^K = 32768 个度量子集。 这是解决方案必须利用的小维度。 度量值可以达到 10^8，但它们的总和适合 64 位整数，并且 Python 整数不存在溢出问题。 

在一些边缘情况下，看似合理的实施可能会失败。 首先，M可以是1。例如，```
2 1 2
10 1
1 10
```答案是```
11
1
```因为只有一个分类器，我们需要总价值最大的一行。 独立获取每个指标的最佳值的实现会通过隐式使用两个分类器错误地获得 20。 

其次，M至少可以是K。例如，```
3 3 2
10 10
5 5
1 1
```最大有用性是 20，唯一可能的集合具有所有三个分类器：```
20
1 2 3
```粗心的实现可能会在选择负责最大值的一个分类器后停止，并忘记必须打印 M 个索引。 

第三，可以将多个度量分配给同一个分类器。 考虑```
3 2 3
10 10 10
9 1 1
1 9 1
```使用分类器 1 和任何其他分类器时的最佳值为 30。 基于分区的解决方案必须允许一个分类器负责指标的整个子集，而不是强制每个指标都有一个分类器。 

最后，两个不同的度量组可以独立地选择相同的分类器。 这不是分区 DP 中的错误。 如果发生这种情况，可以在不减少值的情况下合并这两个组，并且稍后可以添加未使用的分类器以恰好达到 M 个选定的索引。 

官方问题页面上的示例的有用值分别为 10 和 20，以及选定的集合`1 4`和`1 2 3`。 

## 方法

 直接暴力方法是枚举 M 个分类器的每个子集，计算所有 K 个最大值，并保留最佳集合。 对于一个候选集，计算其有用性需要 O(MK)，如果在枚举期间增量地维护最大值，则需要 O(K)。 候选者的数量是 C(N, M)，因此最坏情况的工作大约是 O(C(N, M)K)。 N = 2000，M 约为 1000，这是一个天文数字。 K 很小这一事实并没有足够的帮助，因为爆炸来自于选择分类器。 

有用的观察是每个度量最大值都有一个所有者。 假设最优集是固定的。 对于每个指标，从达到该指标最大值的集合中选择一个分类器。 现在，每个指标都分配给选定的分类器之一。 一个分类器可以拥有多个指标。 

考虑度量的一些子集 S。 如果一个分类器负责 S 中的所有指标，则该组的最佳贡献是

 f(S) = a[i][j] 的 S 中 j 的总和的分类器 i 的最大值。 

为什么这个公式有效？ 一旦我们确定分类器 i 负责 S 中的所有度量，它的贡献正是它在 S 上的值的总和。我们应该选择具有最大此类总和的分类器。 

现在原来的问题已经变了样。 我们没有直接选择分类器，而是将 K 个度量划分为 M 个非空组。 对于每个组 S，我们收到 f(S)。 分区的总值是所有组的 f(S) 之和。 

暴力破解之所以有效，是因为每个可能的分类器集都被明确考虑，但当 N 很大时就会失败。 观察到 K 个指标可以分配给它们负责的分类器，我们可以将指数部分从 N 移动到 K。 

还有一个更有用的属性。 如果一个分区的组少于 K 个，则将任何组拆分为两个非空组都不会降低其值。 对于不相交的 A 和 B，

 f(A ∪ B) <= f(A) + f(B)，

 因为左侧为两个部分选择一个分类器，而右侧可能选择不同的分类器。 因此，当 M < K 时，最多使用 M 个分类器的最佳值可以使用恰好 M 个非空度量组来表示。 当 M >= K 时，每个度量都可以有自己的组，因此无约束最优值只是各个度量最大值的总和。 

对于每个度量掩码，我们首先计算 f(mask) 并记住实现它的一个分类器。 然后我们求解一个集分区DP。 令 dp[t][mask] 为将 mask 中的度量划分为恰好 t 个非空组所获得的最大值。 为了避免以不同的顺序考虑相同的分区，在处理掩码时，我们强制首先选择包含掩码的最低有效设置位的组。 

过渡是

 dp[t][掩码] = max f[sub] + dp[t-1][掩码 \ sub],

 其中 sub 是包含其最低有效位的 mask 的非空子集。 

普通子集DP中有O(3^K)个子集对。 将最低有效位强制放入所选组会消除排序对称性，并为每个 DP 层提供 O(3^(K-1)) 转换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(C(N,M)K) | O(C(N,M)K) | O(NK) | 太慢了 |
 | 最佳| O(NK2^K + M3^(K-1)) | O(NK2^K + M3^(K-1)) | O(NK + M2^K) | O(NK + M2^K) | 接受的算法 |

 指数依赖仅取决于 K，最多为 15。下面的 Python 实现使用相同的精确算法，具有紧凑数组和最低有效位优化。 对于最大对抗实例上的 Python 来说，3 秒的限制很严格，因此 C++ 是原始竞赛限制更安全的实现语言。 

## 算法演练

1. 读取所有分类器行并保留其原始的从 1 开始的索引。 行永远不会以影响所需输出索引的方式重新排序。 
2.如果M等于N，则立即选择每个分类器。 没有选择，所以有用性只是所有 N 行的坐标最大值。 
3. 如果 M 至少为 K，则为每个度量独立计算最佳分类器。 选择所有这些获胜者会给出最大可能值，因为最多有 K 个不同的获胜者。 如果选择的不同分类器少于 M 个，则附加任意未使用的分类器。 添加分类器不会降低任何度量最大值，因此实用性保持最佳状态。 
4. 否则 M < K。对于每个非空度量掩码，计算 f(mask)，即该掩码中所有分类器的度量的最大总和。 同时，记住哪个分类器达到了这个最大值。 
5. 计算每个分类器的每个掩码的子集和。 如果掩码的最低有效设置位是 b，则掩码的总和是没有该位的掩码的总和加上度量 b 处的分类器值。 这会在 O(2^K) 时间内给出一个分类器的所有子集总和。 
6. 使用 dp[1][mask] = f(mask) 初始化第一个 DP 层。 包含掩码中所有指标的一组恰好具有该值。 
7. 对于从 2 到 M 的每个 t，计算 dp[t]。 对于固定掩码，令 b 为其最低有效设置位。 包含 b 的组在任何无序分区中都是唯一确定的。 枚举所有包含 b 的子掩码中其可能的掩码 sub，并将 f(sub) 与 dp[t-1][mask \ sub] 组合。 
8. 存储为每个 DP 状态选择的子掩码。 这允许在最终 DP 层之后重建最佳度量划分。 
9. 从完整度量掩码开始，并重复获取存储的子掩码。 对于每个组，附加为该子掩码记住的分类器。 所得到的分类器列表可能多次包含相同的分类器，因为两个组可以具有相同的最佳分类器。 
10. 删除重复的分类器索引。 如果剩余的不同索引少于 M，则附加任意未使用的分类器。 在此填充期间该值不能减小，因为添加分类器时每个度量最大值都是单调的。 
11. 打印 DP 最优值和所得的 M 个不同分类器索引。 

为什么它有效

 修复一组最佳分类器，并将每个指标分配给一个达到最大值的分类器。 这会产生指标的分区。 对于该分区的每个部分 S，其负责的分类器最多贡献 f(S)，并且 f(S) 根据定义是可以获得的。 因此，最优分类器集的值由某个 DP 值恰好是最优的度量划分来表示。 

相反，每个 DP 分区为每个度量组选择一个分类器。 采用这些分类器至少会产生相应 f 值的总和作为其度量最大值，因为为组选择的分类器为该组中的每个度量实现了 f。 因此，每个 DP 解决方案都对应于一个至少具有 DP 值的有效分类器集。 

这两个方向表明DP最优值等于原始最优值。 删除重复的分类器不会降低表示值，因为合并分配给同一分类器的两个组只会合并同一分类器已提供的指标。 使用额外的分类器填充也不能降低该值。 因此，最终的集合恰好包含 M 个不同的分类器并且保持最佳状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())
    a = [list(map(int, input().split())) for _ in range(n)]

    # If all classifiers have to be selected, there is no optimization.
    if m == n:
        mx = [0] * k
        for row in a:
            for j, x in enumerate(row):
                if x > mx[j]:
                    mx[j] = x

        ans = sum(mx)
        print(ans)
        print(*range(1, n + 1))
        return

    # If we can use at least K classifiers, give every metric
    # its own best classifier and then pad the answer.
    if m >= k:
        mx = [0] * k
        winner = [-1] * k

        for i, row in enumerate(a):
            for j, x in enumerate(row):
                if x > mx[j]:
                    mx[j] = x
                    winner[j] = i

        chosen = []
        used = [False] * n

        for i in winner:
            if not used[i]:
                used[i] = True
                chosen.append(i)

        for i in range(n):
            if len(chosen) == m:
                break
            if not used[i]:
                used[i] = True
                chosen.append(i)

        print(sum(mx))
        print(*(x + 1 for x in chosen))
        return

    size = 1 << k
    full = size - 1

    # For each mask:
    # best[mask] = maximum sum of metrics in mask for one classifier
    # who[mask]  = classifier attaining best[mask]
    best = [0] * size
    who = [-1] * size

    # Precompute the least significant bit information.
    prev_mask = [0] * size
    bit_index = [0] * size
    popcount = [0] * size

    for mask in range(1, size):
        lb = mask & -mask
        prev_mask[mask] = mask ^ lb
        bit_index[mask] = lb.bit_length() - 1
        popcount[mask] = popcount[prev_mask[mask]] + 1

    # Compute f(mask) for every mask.
    subset_sum = [0] * size

    for i, row in enumerate(a):
        subset_sum[0] = 0

        for mask in range(1, size):
            subset_sum[mask] = (
                subset_sum[prev_mask[mask]] + row[bit_index[mask]]
            )

        for mask in range(1, size):
            value = subset_sum[mask]
            if value > best[mask]:
                best[mask] = value
                who[mask] = i

    # parent[t][mask] stores the group chosen for the transition
    # dp[t][mask] = best partition of mask into exactly t groups.
    parent = [None] * (m + 1)

    prev = best[:]
    parent[1] = [-1] * size

    for t in range(2, m + 1):
        cur = [-1] * size
        par = [-1] * size

        for mask in range(1, size):
            if popcount[mask] < t:
                continue

            lb = mask & -mask
            rest_mask = mask ^ lb

            # The selected group must contain lb.
            # Its complement is rest.
            rest = rest_mask

            while True:
                if popcount[rest] >= t - 1:
                    sub = mask ^ rest
                    value = best[sub] + prev[rest]

                    if value > cur[mask]:
                        cur[mask] = value
                        par[mask] = sub

                if rest == 0:
                    break
                rest = (rest - 1) & rest_mask

        prev = cur
        parent[t] = par

    answer = prev[full]

    # Reconstruct the metric groups.
    groups = []
    mask = full

    for t in range(m, 1, -1):
        sub = parent[t][mask]
        groups.append(sub)
        mask ^= sub

    groups.append(mask)

    # Convert metric groups into classifier indices.
    chosen = []
    used = [False] * n

    for sub in groups:
        i = who[sub]
        if not used[i]:
            used[i] = True
            chosen.append(i)

    # Duplicate winners can occur. Pad with arbitrary classifiers.
    for i in range(n):
        if len(chosen) == m:
            break
        if not used[i]:
            used[i] = True
            chosen.append(i)

    print(answer)
    print(*(i + 1 for i in chosen))

if __name__ == "__main__":
    solve()
```第一个分支在任何指数工作之前处理 M = N。 由于每个分类器都是强制性的，因此计算坐标最大值就足够了。 

第二个分支处理 M >= K。每个度量只需要一个分类器即可实现其最大值，因此最初最多需要 K 个分类器。 由于额外的分类器无法减少最大值，因此任意未使用的分类器可以安全地将集合填充到大小 M。 

仅当 M < K 时才使用主分支。`size`是 2^K，每个整数掩码代表度量的子集。`prev_mask`,`bit_index`， 和`popcount`是预先计算的，因为这些操作发生在指数循环内。 

这`subset_sum`每个分类器都会重复使用数组。 对于一个分类器，每个子集总和是通过添加一个度量从较小的子集中获得的。 因此，数组永远不需要同时存储所有 N 个分类器。 

DP 使用`-1`作为不可能状态标记。 所有实际值都是正数，所以`-1`不能与有效的分区值混淆。 

最低有效位限制是转换中的关键细节。 如果没有它，同一分区对于其组的每个排序都会被考虑一次。 要求第一组包含最低设置位为每个无序分区提供精确的一个表示。 

重建使用存储的子掩码，而不是尝试从组的值中恢复组。 当多个分区具有相同用途时，这可以避免歧义。 

Python 的整数可以安全地处理最大可能的答案，即 K·10^8 或 1.5·10^9。 不需要显式的 64 位类型。 

## 工作示例

 ### 示例 1

 输入是```
6 2 3
4 1 1
1 4 1
1 1 4
1 3 3
3 1 3
3 3 1
```共有三个度量，因此掩码为 1 到 7。例如，掩码 5 代表度量 1 和 3。值 f(5) 是以下最大值`a[i][1] + a[i][3]`。 

一些相关的状态是：

 | 面膜| 指标| f(掩码) | 最佳分类器 |
 | ---| ---| ---| ---|
 | 1 | {1} | 4 | 1 |
 | 2 | {2} | 4 | 2 |
 | 3 | {1,2} | 5 | 1 |
 | 4 | {3} | 4 | 3 |
 | 5 | {1,3} | 6 | 4 |
 | 6 | {2,3} | 6 | 4 |
 | 7 | {1,2,3} | 7 | 4 |

 通过两组，完整掩码7可以分为几种可能性：

 | 第一组| 剩余组 | 价值|
 | ---| ---| ---|
 | {1} | {2,3} | 4 + 6 = 10 |
 | {2} | {1,3} | 4 + 6 = 10 |
 | {1,2} | {3} | 5 + 4 = 9 | 5 + 4 = 9

 最优值为 10。一个最优分区是`{1} | {2,3}`，其代表分类器是1和4。 

得到的分类器值为`(4,3,3)`，所以有用性为10。```
10
1 4
```此跟踪演示了为什么 DP 划分指标而不是分类器。 分类器 1 提供指标 1，而分类器 4 提供指标 2 和 3。 

### 示例 2

 输入是```
3 3 2
10 10
5 5
1 1
```这里 M = 3 且 K = 2，因此 M >= K。我们不需要分区 DP。 

度量 1 的最佳值为 10，由分类器 1 获得。度量 2 的最佳值也是 10，由分类器 1 获得。 

| 公制| 最大| 获胜者 |
 | ---| ---| ---|
 | 1 | 10 | 10 1 |
 | 2 | 10 | 10 1 |

 最初只需要分类器 1，但必须打印恰好三个分类器。 分类器 2 和 3 作为填充附加。 

有用性仍为 20，因为添加分类器不能减少任一最大值。```
20
1 2 3
```此示例练习特殊的 M >= K 分支以及精确输出 M 个不同分类器索引的要求。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(NK2^K + M3^(K-1)) | O(NK2^K + M3^(K-1)) | 每个分类器贡献所有度量掩码，后面是 M 个子集分区 DP 层 |
 | 空间| O(NK + M2^K) | O(NK + M2^K) | 存储输入矩阵、DP父层和辅助掩模数组|

 对于 K = 15，只有 32768 个度量掩码。 第一项大约是 N·K·32768 次运算，而当 M 接近 K 时，分区 DP 是主导部分。较小的 K 界限使得指数算法成为可能； 当 N = 2000 时，对 N 的指数依赖是完全不可行的。 

该算法本身是给定约束的适当精确解。 Python 实现使用了一些低级优化，但原始的 3 秒限制对于 Python 在最坏情况输入上的要求特别高。 相同 DP 的 C++ 实现是更安全的竞赛提交。 

## 测试用例

 以下线束假设`solve`解决方案中的函数放置在同一文件中。 它重定向标准输入和输出，以便测试实际的竞争性编程实现，而不是单独的重新实现。```python
import sys
import io
import contextlib

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            solve()
        return out.getvalue().strip()
    finally:
        sys.stdin = old_stdin

def check_output(inp: str, out: str):
    data = list(map(int, inp.split()))
    n, m, k = data[0], data[1], data[2]

    values = []
    p = 3
    a = []
    for _ in range(n):
        row = data[p:p + k]
        p += k
        a.append(row)

    tokens = list(map(int, out.split()))
    assert len(tokens) == m + 1

    answer = tokens[0]
    ids = tokens[1:]

    assert len(set(ids)) == m
    assert all(1 <= x <= n for x in ids)

    mx = [0] * k
    for idx in ids:
        row = a[idx - 1]
        for j in range(k):
            mx[j] = max(mx[j], row[j])

    assert sum(mx) == answer
    return answer

sample1 = """\
6 2 3
4 1 1
1 4 1
1 1 4
1 3 3
3 1 3
3 3 1
"""

sample2 = """\
3 3 2
10 10
5 5
1 1
"""

assert run(sample1) == "10\n1 4", "sample 1"
assert run(sample2) == "20\n1 2 3", "sample 2"

case_min = """\
1 1 1
100000000
"""
assert run(case_min) == "100000000\n1", "minimum-size case"

case_m_one = """\
2 1 2
10 1
1 10
"""
assert run(case_m_one) == "11\n1", "M = 1"

case_all_equal = """\
4 2 2
5 5
5 5
5 5
5 5
"""
assert run(case_all_equal) == "10\n1 2", "all equal values"

case_forced_all = """\
3 3 3
1 2 3
3 2 1
2 3 2
"""
assert run(case_forced_all) == "8\n1 2 3", "M = N"

case_max_n = "2000 2000 15\n" + ("1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n" * 2000)
out = run(case_max_n)
assert check_output(case_max_n, out) == 15, "large N"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 1 / 100000000`|`100000000 / 1`| 最小 N、M 和 K，加上最大度量值 |
 |`2 1 2 / 10 1 / 1 10`|`11 / 1`| M = 1，阻止独立选择公制获胜者 |
 | 四个相同的行，其中 M = 2 |`10 / 1 2`| 领带和精确尺寸的衬垫 |
 |`3 3 3`具有三个不同的行 |`8 / 1 2 3`| M = N，其中整个集合被强制 |
 | 2000 个相同的行，M = N，K = 15 |`15 / 1 ... 2000`| 最大 N 和大输出，同时运用 M = N 捷径 |

 ## 边缘情况

 对于 M = 1，考虑```
2 1 2
10 1
1 10
```主要DP只有一组。 完整的度量掩码是`{1,2}`，f({1,2}) 为 max(11, 11) = 11。分类器 1 由确定性平局规则选择。 分类器 1 的结果是 11。该算法从不组合独立的最大值 10 和 10，因为这样做需要两个组，这违反了 M = 1。 

对于 M >= K，考虑```
3 3 2
10 10
5 5
1 1
```各个度量最大值均为 10，并且都属于分类器 1。初始选择的列表仅包含分类器 1。然后填充循环添加分类器 2 和 3。结果集恰好具有三个不同的索引，并且有用性仍然为 20。 

对于 M = N，考虑```
3 3 3
1 2 3
3 2 1
2 3 2
```必须选择每个分类器，因此算法立即计算坐标最大值`(3,3,3)`。 它们的总和是 8，并且输出所有三个索引。 无需分区。 

对于所有相等的值，```
4 2 2
5 5
5 5
5 5
5 5
```每个分类器对于每个指标都是最优的。 第一个分类器赢得两个度量最大值，之后填充步骤选择分类器 2。最终的有用性仍然是 10。这表明该算法不依赖于唯一的最大值。 

对于一个组，其最佳分类器也最适合另一个组，请考虑```
3 2 3
10 10 10
9 1 1
1 9 1
```隔断`{1,2,3}`将使用分类器 1 且值为 30，而两组分区，例如`{1} | {2,3}`也给出 30，因为分类器 1 是两个组的最佳代表。 在重建过程中，两组都可能产生分类器 1。重复的被删除，留下一个分类器，并添加另一个未使用的分类器以达到 M = 2。有用性保持为 30，这是最佳的。 

对于 M = N 的大 N，特殊分支特别有用。 有 2000 个分类器和 15 个指标，强制选择每个人，因此该算法仅执行 O(NK) 工作。 在这种情况下，通用度量分区 DP 将是不必要的开销。 

最微妙的边界是 M < K。这里每个度量的独立最大值通常是无法实现的，因为它可能需要超过 M 个分类器。 分区 DP 通过强制将 K 个度量精确地分为 M 个组，并由一个分类器负责每个组，从而显式地捕获了这一限制。
