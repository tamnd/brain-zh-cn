---
title: "CF 102215E - 第三方软件 - 2"
description: "我们有 (n) 个库版本。 版本 (i) 提供了每个编号位于包含区间 ([ai,bi]) 内的函数。 Pavel 需要从 (1) 到 (m) 的每个函数，因此所选版本必须共同覆盖整个区间 ([1,m])。 该任务有两个部分。"
date: "2026-08-20T02:46:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102215
codeforces_index: "E"
codeforces_contest_name: "2019, XII Samara Regional Intercollegiate Programming Contest"
rating: 0
weight: 102215
solve_time_s: 384
verified: false
draft: false
---

[CF 102215E - 第三方软件 - 2](https://codeforces.com/problemset/problem/102215/E)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 24s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有 (n) 个库版本。 版本 (i) 提供了编号位于包含区间 ([a_i,b_i]) 内的每个函数。 Pavel 需要从 (1) 到 (m) 的每个函数，因此所选版本必须共同覆盖整个区间 ([1,m])。 

该任务有两个部分。 首先，我们必须确定是否存在这样的版本集合。 如果是，我们必须找到尽可能少的版本并输出它们的索引。 间隔可能会重叠，并且一个版本只能使用一次。 

(m) 的值可以大到 (10^9)，因此将每个函数编号视为单独的数组位置是不可行的。 间隔的数量最多为 (2\cdot10^5)，这意味着 (O(n^2)) 算法在最坏的情况下已经需要大约 (4\cdot10^{10}) 间隔操作。 由于 2 秒的限制，我们需要接近 (O(n\log n)) 或 (O(n)) 的时间。 对间隔进行一次排序是可以接受的，但重复比较每对间隔则不可接受。 

有几种边界情况可能会导致看似合理的解决方案失败。 如果第一个有用的区间不是从函数 (1) 开始，那么答案立即不可能。 例如，```
2 5
2 5
3 5
```没有包含函数 (1) 的版本，所以答案是`NO`。 仅检查最大右端点是否达到 (m) 的解决方案会错误地接受它。 

第二种情况是中间有缺口：```
3 8
1 3
4 5
7 8
```区间覆盖 (1) 到 (5)，然后不覆盖函数 (6)。 正确的输出是`NO`。 仅检查并集的最小和最大端点是不够的，因为断开的间隔无法覆盖间隙。 

另一个微妙的情况是重叠间隔，其中采用第一个可用间隔不是最佳的：```
3 8
1 3
1 5
5 8
```最佳答案使用版本 (2) 和 (3)，覆盖 ([1,5])，然后覆盖 ([5,8])。 首先选择版本 (1) 会导致前缀较短，并且需要附加版本。 贪心算法必须选择将覆盖前缀延伸最远的区间，而不仅仅是可以延续它的第一个区间。 

最后，当一个区间已经涵盖了所有内容时，答案必须恰好包含一个版本：```
1 10
1 10
```正确的结果是`YES`， 其次是`1`和版本`1`。 坚持在达到 (m) 后寻找第二个间隔的算法会引入不必要的选择。 

## 方法

 直接强力方法是考虑 (n) 个版本的每个子集。 对于每个子集，我们可以收集其间隔，确定并集，并检查该并集是否包含从 (1) 到 (m) 的每个函数。 在所有成功的子集中，我们保留一个具有最小大小的子集。 这是正确的，因为每个可能的购买决策都对应于一个子集。 

问题是子集的数量。 它们有 (2^n) 个，甚至通过扫描所有 (n) 个间隔来检查子集也会给出 (O(n2^n)) 时间。 对于 (n=200000)，这远远超出了任何实际限制。 即使算法以某种方式在恒定时间内检查每个子集，仍然会出现不可能的 (2^{200000}) 状态。 

The useful structure comes from the fact that all functions form one ordered line, from (1) to (m). 假设我们已经购买了一些版本，它们涵盖了 (x) 中的每个功能。 要不间断地继续覆盖，下一个间隔必须在 (x+1) 处或之前开始。 在满足此条件的每个区间中，选择具有最大右端点的区间总是至少与选择任何其他区间一样好。 当仅使用一个版本时，它至少达到了同样的程度。 

这给出了贪婪策略。 按间隔的左端点对间隔进行排序。 从没有覆盖任何内容开始，重复考虑左端点至多是第一个未覆盖函数的每个区间。 Among those intervals, take the one extending farthest to the right. 如果没有这样的间隔扩展当前的覆盖范围，则间隙是不可避免的，答案是`NO`。 

这种贪婪选择是最优的原因是交换论证。 假设当前覆盖的前缀结束于(x)，让贪心算法选择结束于(g)的区间。 从 (x) 继续的任何有效解必须选择某个左端点至多为 (x+1) 的区间。 如果该区间结束于 (r)，则为 (g\ge r)。 用贪婪区间替换它不会使剩余覆盖变得更困难，因为贪婪选择至少达到同样的程度。 在每一步重复这个论证给出了具有最小可能间隔数的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n2^n)) | (O(n)) | (O(n)) | 太慢了 |
 | 排序后贪心 | (O(n\log n)) | (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 读取所有区间及其原始版本索引，然后按左端点对它们进行排序。 排序使我们能够按照间隔可用的确切顺序对其进行处理。 
2. 设置`covered = 0`。 这意味着函数 (1) 到`covered`已经保证可用。 最初没有涵盖任何功能。 
3. 维护指针`i`进入排序的区间。 在每次迭代中，检查每个间隔`a[i] <= covered + 1`。 这样的间隔可以附加到当前覆盖的前缀而不留间隙。 
4. 在所有当前可用的间隔中，保留右端点最大的间隔。 调用此端点`best_end`并记住它的版本索引。 我们不会立即承诺第一个可用间隔，因为稍后的间隔可能会将覆盖范围扩展得更远。 
5. 在 或之前开始的所有间隔之后`covered + 1`已检查，检查是否`best_end`大于`covered`。 如果不是，则没有区间可以覆盖下一个函数，因此无法覆盖完整的范围，我们输出`NO`。 
6. 否则，选择记住的版本，将其原始索引附加到答案中，然后设置`covered = best_end`。 下一次迭代现在尝试扩展这个更大的前缀。 
7. 尽快停止`covered >= m`。 然后覆盖从 (1) 到 (m) 的每个函数，并且所选版本形成有效的解决方案。 
8. 由于每次迭代都选择距当前前缀最远的区间，因此贪心交换论证证明不存在版本数更少的解。 选定的区间可以替换任何最佳延续的第一个区间，而不会降低其覆盖其余函数的能力。 

### 为什么它有效

 不变的是，在每次选择之前，从 (1) 到 (1) 的所有函数`covered`被覆盖，并且选定的间隔使用尽可能少的版本数来至少达到贪婪选择下的那个程度。 在下一次选择之前，会考虑能够继续覆盖的每个区间，并且算法会选择具有最大右端点的区间。 任何替代的有效下一个选择都不会再进一步​​，因此用贪婪间隔替换该选择不能增加随后所需的间隔数量。 如果没有延长可用间隔`covered`，下一个函数未被每个剩余间隔覆盖，因此不存在有效的解决方案。 什么时候`covered`达到 (m) 时，所选间隔以尽可能少的版本数覆盖整个所需范围。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    intervals = []
    for idx in range(1, n + 1):
        a, b = map(int, input().split())
        intervals.append((a, b, idx))

    intervals.sort()

    covered = 0
    i = 0
    answer = []

    while covered < m:
        best_end = covered
        best_idx = -1

        # Every interval starting at or before the next uncovered
        # function can extend the current prefix.
        while i < n and intervals[i][0] <= covered + 1:
            a, b, idx = intervals[i]

            if b > best_end:
                best_end = b
                best_idx = idx

            i += 1

        # No usable interval can extend the covered prefix.
        if best_idx == -1:
            print("NO")
            return

        answer.append(best_idx)
        covered = best_end

    print("YES")
    print(len(answer))
    print(*answer)

if __name__ == "__main__":
    solve()
```元组`(a, b, idx)`存储两个端点和原始版本号。 对这些元组进行排序主要是按`a`，这正是贪婪扫描所需的排序。`covered + 1`是第一个尚未涉及的功能。 当间隔的左端点最多为该值时，该间隔可用。 此条件还可以正确处理重叠间隔。 例如，如果`covered == 5`，一个区间开始于`5`是可用的，因为它已经与覆盖区域重叠，而从`7`叶子函数`6`裸露。 

内循环前进`i`永久。 一旦某个间隔被视为当前前缀的候选者，就不再需要再次检查它。 如果它的右端点现在不是最佳扩展，那么在覆盖的前缀向前移动后，它就不能成为更好的候选者，因为它的端点是固定的，并且算法只对扩展当前边界的间隔感兴趣。 

支票`best_idx == -1`检测初始间隙和随后出现的间隙。 例如，如果`covered == 3`每个剩余的间隔开始于`5`或更高版本，没有一个可以覆盖功能`4`，所以继续下去是不可能的。 

该算法一旦停止`covered >= m`，因此超出 (m) 的间隔是完全可以接受的。 无需剪裁其端点。 Python 整数也具有任意精度，因此不存在溢出问题。 

## 工作示例

 ### 示例 1

 间隔已按其左端点的升序排列。 该表显示了每次选择后的贪婪边界。 

| 迭代| 接下来揭开| 可用间隔| 选择的版本 | 新盖 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 1：[1,2] | 1 | 2 |
 | 2 | 3 | 2：[3,4] | 2 | 4 |
 | 3 | 5 | 3：[5,6] | 3 | 6 |
 | 4 | 7 | 4：[7,8] | 4 | 8 |

 选择版本（1）后，函数（3）成为下一个未覆盖的函数，因此版本（2）正是贪心规则所需的区间。 同样的过程一直持续到`covered = 8`，给出四个选定的版本`1 2 3 4`。 

此示例还说明了为什么间隔被解释为包容性的。 ([3,4]) 后面的区间 ([1,2]) 没有间隙，因为函数 (2) 和函数 (3) 是连续的。 

### 示例 2

 间隔是```
1: [1,5]
2: [2,7]
3: [3,4]
4: [6,8]
```排序后，它们已经按照显示顺序排列了。 扫描的行为如下。 

| 迭代| 接下来揭开| 检查可用间隔 | 选择的版本 | 新盖 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 1：[1,5] | 1 | 5 |
 | 2 | 6 | 2:[2,7]、3:[3,4]、4:[6,8] | 4 | 8 |

 第一次迭代时，只有从(1)开始的区间才能开始覆盖，因此选择版本(1)。 一旦功能（1）到（5）被覆盖，版本（2）和版本（4）都可以继续该范围。 版本(4)达到(8)，而版本(2)仅达到(7)，所以贪心选择是版本(4)。 

最终的答案是`1 4`，使用两个版本。 没有一个版本同时涵盖功能 (1) 和功能 (8)，因此两个版本是最少的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n)) | (O(n\log n)) | 排序成本 (O(n\log n))，并且之后每个间隔都扫描一次。 |
 | 空间| (O(n)) | (O(n)) | 间隔和选定的版本索引需要线性存储。 |

 使用 (n\le200000)，对 (200000) 个间隔进行排序，然后进行一次线性传递，完全符合 Python 中 2 秒限制的预期范围。 (m) 的值不会出现在复杂度中，因为该算法从不迭代各个函数。 即使 (m=10^9) 时，它也仅比较区间端点。 

## 测试用例

 输出可以包含任何最佳的版本索引集，因此强大的测试工具应该验证返回的解决方案，而不是需要特定的索引顺序。 以下测试可以做到这一点，同时还检查所选版本的数量是否对于所提供的案例来说是最佳的。```python
# This test harness reimplements the solution as a callable function.
import sys
import io

def solve_io(data: str) -> str:
    inp = io.StringIO(data)
    out = io.StringIO()

    n, m = map(int, inp.readline().split())
    intervals = []

    for idx in range(1, n + 1):
        a, b = map(int, inp.readline().split())
        intervals.append((a, b, idx))

    intervals.sort()

    covered = 0
    i = 0
    answer = []

    while covered < m:
        best_end = covered
        best_idx = -1

        while i < n and intervals[i][0] <= covered + 1:
            a, b, idx = intervals[i]
            if b > best_end:
                best_end = b
                best_idx = idx
            i += 1

        if best_idx == -1:
            out.write("NO\n")
            return out.getvalue()

        answer.append(best_idx)
        covered = best_end

    out.write("YES\n")
    out.write(str(len(answer)) + "\n")
    out.write(" ".join(map(str, answer)) + "\n")
    return out.getvalue()

def validate(data: str, output: str, expected_k=None):
    lines = output.strip().splitlines()
    assert lines, "empty output"

    if lines[0] == "NO":
        assert expected_k is None
        return

    assert lines[0] == "YES"
    assert len(lines) == 3

    n, m = map(int, data.splitlines()[0].split())
    intervals = [None]

    for line in data.splitlines()[1:]:
        a, b = map(int, line.split())
        intervals.append((a, b))

    k = int(lines[1])
    chosen = list(map(int, lines[2].split()))

    assert len(chosen) == k
    assert len(set(chosen)) == k
    assert all(1 <= x <= n for x in chosen)

    covered = [False] * (m + 1)
    for idx in chosen:
        a, b = intervals[idx]
        for x in range(a, b + 1):
            covered[x] = True

    assert all(covered[1:]), "selected intervals do not cover [1, m]"

    if expected_k is not None:
        assert k == expected_k

# Provided sample 1
sample1 = """\
4 8
1 2
3 4
5 6
7 8
"""
out = solve_io(sample1)
validate(sample1, out, expected_k=4)

# Provided sample 2
sample2 = """\
4 8
1 5
2 7
3 4
6 8
"""
out = solve_io(sample2)
validate(sample2, out, expected_k=2)

# Provided sample 3
sample3 = """\
3 8
1 3
4 5
6 7
"""
out = solve_io(sample3)
assert out.strip() == "NO"

# Minimum-size input: one version covers the only function.
case4 = """\
1 1
1 1
"""
out = solve_io(case4)
validate(case4, out, expected_k=1)

# All intervals equal. One copy is sufficient.
case5 = """\
5 10
1 10
1 10
1 10
1 10
1 10
"""
out = solve_io(case5)
validate(case5, out, expected_k=1)

# Greedy choice matters. Taking [1, 3] first would need more intervals.
case6 = """\
4 10
1 3
1 6
4 8
7 10
"""
out = solve_io(case6)
validate(case6, out, expected_k=2)

# Boundary gap at the beginning.
case7 = """\
3 5
2 5
3 5
1 1
"""
out = solve_io(case7)
validate(case7, out, expected_k=2)

# Maximum-size input pattern. Each interval covers one function.
n = 200000
case8 = str(n) + " " + str(n) + "\n"
case8 += "".join(f"{i} {i}\n" for i in range(1, n + 1))
out = solve_io(case8)
validate(case8, out, expected_k=n)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 1 1`|`YES`, (k=1) | 最小尺寸输入和立即终止|
 | 五份`[1,10]`|`YES`, (k=1) | 重复间隔并避免不必要的选择 |
 |`[1,3], [1,6], [4,8], [7,10]`|`YES`, (k=2) | 选择最远的间隔 |
 |`[2,5], [3,5], [1,1]`|`YES`, (k=2) | 起始边界和`covered + 1`处理 |
 | (200000) 单例间隔 |`YES`, (k=200000) | 最大值(n)、排序后线性扫描、连续边界|

 提供的样本还涵盖了精确的连续间隔、重叠间​​隔和不可能的间隙。 

## 边缘情况

 第一个边缘情况是一个未被覆盖的开始。 考虑```
2 5
2 5
3 5
```初始值为`covered = 0`，所以下一个所需的函数是`1`。 两个区间的左端点都大于`1`，这意味着内部循环不检查可用的间隔。`best_idx`遗迹`-1`，算法打印`NO`。 某个区间到达函数(5)并不重要，因为函数(1)已经不可能获得。 

中间间隙的情况是```
3 8
1 3
4 5
7 8
```第一个选择发生变化`covered`从`0`到`3`。 下一个需要的函数是`4`， 所以`[4,5]`可用并改变`covered`到`5`。 下一个需要的函数是`6`， 但`[7,8]`开始太晚了。 没有候选人可以扩展前缀，因此算法打印`NO`。 检查是在每个边界进行的，这可以防止断开的覆盖被误认为是完整的覆盖。 

贪心选择的情况是```
3 8
1 3
1 5
5 8
```最初两者`[1,3]`和`[1,5]`可用。 扫描保留较大的端点并选择版本 (2)，给出`covered = 5`。 下一个需要的函数是`6`， 所以`[5,8]`可用并将覆盖范围扩展到`8`。 答案使用两个版本。 选择第一个可用间隔的粗心实现会选择`[1,3]`，之后`[5,8]`无法覆盖功能（4），强制执行不正确的额外步骤或错误地报告失败。 

单版本案例是```
1 10
1 10
```第一次迭代考虑唯一的区间和集合`covered = 10`。 外循环条件`covered < m`现在为 false，因此算法立即停止并输出一个选定的版本。 这说明了为什么必须在更新边界后检查终止条件，而不是无条件地搜索另一个区间。 

最大尺寸边界情况使用 (200000) 个单例区间`[1,1], [2,2], ..., [200000,200000]`。 选择后`[i,i]`，下一个所需的函数正是 (i+1)，因此下一个单例可用。 每个区间处理一次，算法在（200000）次选择后完成。 这证实了该解决方案不依赖于 (m) 较小，并且可以处理预期 (O(n\log n)) 范围内允许的最大版本数。
