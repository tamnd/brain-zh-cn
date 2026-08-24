---
title: "CF 102215E - 第三方软件 - 2"
description: "我们有 n 个库版本。 版本 i 提供了每个编号位于包含区间 [ai, bi] 内的函数。 Pavel 需要从 1 到 m 的每个函数，因此购买的区间必须共同覆盖整个整数范围 [1, m]。 该任务有两个部分。"
date: "2026-08-24T16:52:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102215
codeforces_index: "E"
codeforces_contest_name: "2019, XII Samara Regional Intercollegiate Programming Contest"
rating: 0
weight: 102215
solve_time_s: 2403
verified: true
draft: false
---

[CF 102215E - 第三方软件 - 2](https://codeforces.com/problemset/problem/102215/E)

 **评级：** -
 **标签：** -
 **求解时间：** 40m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`库版本。 版本`i`提供编号位于包含区间内的每个函数`[a_i, b_i]`。 帕维尔需要以下的每个功能`1`通过`m`，因此购买的区间必须共同覆盖整个整数范围`[1, m]`。 

该任务有两个部分。 首先，我们必须确定这样的版本集合是否存在。 如果是这样，我们必须找到版本数量尽可能少的集合并打印它们的原始索引。 

的大值`m`, 直至`10^9`，立即排除迭代每个函数编号的算法。 有用的尺寸参数是`n`，这最多是`200000`，所以一个`O(n log n)`算法适合两秒的限制。 一个`O(n^2)`搜索对或更大的组合将需要大约`4 * 10^10`区间比较，远远超出了允许的范围。 

有几种边界情况可能会破坏粗心的实现。 如果第一个间隔不是从函数开始`1`，覆盖是不可能的。 例如，```
2 5
2 5
1 1
```实际上是可能的，因为第二个版本涵盖了功能`1`第一个封面`2`通过`5`。 简单地选择全局具有最大右端点的区间的贪心算法将选择`[2,5]`首先，可能会错误地得出该函数的结论`1`失踪了。 在最大化右端点之前，算法必须尊重左边界。 

当存在真正的差距时，会发生更直接的故障：```
2 5
1 2
4 5
```正确答案是`NO`，因为函数`3`不可用。 仅根据其右端点选择间隔并不能正确检测到这一点，除非要求下一个间隔最多在当前覆盖的前缀之后的一个位置开始。 

另一个边缘情况是一个区间恰好从第一个未覆盖的函数开始：```
3 6
1 2
3 4
5 6
```答案是`YES`有三个版本。 由于函数是整数，覆盖后`2`，一个区间开始于`3`是完全有效的。 条件是`a_i <= covered + 1`， 不是`a_i <= covered`。 

最后，重叠的间隔可能会使局部短视的选择变得次优：```
3 8
1 3
2 7
6 8
```最优解使用`[1,3]`和`[2,7]`仅当另一个间隔达到`8`，但事实并非如此，所以在这个特定的输入中，答案是`NO`。 如果我们将最后一个间隔更改为`[6,8]`，同样的推理说明了为什么每个选定的间隔必须扩展当前覆盖的前缀。 贪心选择应该始终在可以继续当前覆盖范围的所有区间中最大化新的右端点。 

## 方法

 暴力方法直接来自定义。 我们可以尝试库版本的每个子集，检查联合是否涵盖`[1,m]`，并保留最小的有效子集。 这是正确的，因为每个可能的购买决定都被明确考虑，但也有`2^n`子集。 和`n = 200000`，那是无可救药的大。 

即使将蛮力限制为对、三元组或其他小组合也不能解决一般问题。 例如，检查每一对已经花费了`O(n^2)`，大约达到`2 * 10^10`配对时`n = 200000`。 该问题需要一种贪婪地做出选择而不是枚举组合的方法。 

关键的观察是我们已经介绍过的函数总是形成一个前缀`[1, x]`。 认为`x`是目前覆盖的最大的函数。 任何可以扩展此前缀的区间都必须满足`a_i <= x + 1`。 在所有这样的区间中，选择最大的一个`b_i`没有比选择右端点更小的更糟糕的了。 两种选择都可以开始下一部分的覆盖范围，但间隔更远只能让至少同样多的剩余问题得到解决。 

这给出了最小区间覆盖的标准贪婪策略。 按间隔的左端点对间隔进行排序。 开始于`covered = 0`，扫描左端点最多为的每个区间`covered + 1`并记住具有最大右端点的那个。 一旦扫描到达从右侧开始太远的间隔，我们必须致力于迄今为止找到的最佳间隔，因为已经考虑了每个当前可用的间隔。 如果最佳间隔不延长`covered`，有差距，答案是不可能的。 

暴力破解之所以有效，是因为它明确地搜索了扩展覆盖区域的所有方法，但由于选择的数量呈指数级增长，所以会失败。 观察到只有最远的可用间隔才重要，从而将搜索减少为一次排序扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(2^n n)`|`O(n)`| 太慢了 |
 | 最优贪心|`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 将每个间隔及其原始版本号存储在一起，然后按左端点对间隔进行排序。 排序使我们能够处理当前可以在单个前向扫描中继续覆盖的前缀的所有间隔。 
2. 设置`covered = 0`。 这意味着还没有覆盖任何函数，所以我们需要的第一个函数是`1`。 
3. 扫描排序后的区间。 当一个区间有`a_i <= covered + 1`，它可以直接连接到已经覆盖的前缀。 在所有这些间隔中，保留最大的间隔`b_i`。 
4. 当下一个间隔开始时`covered + 1`，停止考虑当前组并购买记住的间隔。 这是可以扩展当前前缀的每个间隔中的最佳选择。 
5. 更新`covered`到所选间隔的右端点并将其原始索引添加到答案中。 然后从第一个尚未考虑的区间继续扫描。 
6. 如果没有找到可用的区间，则无法覆盖下一个功能。 之间存在差距`covered`和剩余的间隔，所以正确答案是`NO`。 
7.如果`covered >= m`，整个所需范围`[1,m]`被覆盖。 选定的间隔形成有效的解决方案。 

贪婪选择是最优的原因可以通过交换参数来捕获。 假设当前前缀结束于`covered`。 每个有效的解决方案都必须选择某个区间`a_i <= covered + 1`继续报道。 让贪心算法选择一个结束于的合格区间`G`，而最佳解决方案选择结束于的合格区间`O`。 由于贪心选择最大化了正确的端点，`G >= O`。 用贪婪区间替换最优解的第一个选择的区间不会使以后的覆盖变得更加困难，因为贪婪区间至少达到同样的程度。 在每次扩展时重复此参数表明贪心算法使用尽可能少的间隔数。 

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

    ans = []
    covered = 0
    i = 0

    while covered < m:
        best_right = covered
        best_idx = -1

        while i < n and intervals[i][0] <= covered + 1:
            a, b, idx = intervals[i]

            if b > best_right:
                best_right = b
                best_idx = idx

            i += 1

        if best_idx == -1:
            print("NO")
            return

        ans.append(best_idx)
        covered = best_right

    print("YES")
    print(len(ans))
    print(*ans)

if __name__ == "__main__":
    solve()
```输入首先被转换为`(left, right, original_index)`triples. 保留原始索引是必要的，因为排序会更改间隔的存储顺序，而输出必须引用输入中出现的版本。 

The sorted scan uses`covered + 1`而不是`covered`。 由于函数是用整数编号的，因此从下一个未覆盖的函数开始的间隔完美地连接到当前前缀。 例如，通过覆盖`5`可以通过以下方式扩展`[6,8]`。 

在内循环内部，`best_right`记录当前可用的每个间隔中的最远端点。 我们前进`i`一旦检查了一个区间，每个区间就进入内循环一次。 当下一个间隔有`a_i > covered + 1`，当前步骤中不能使用未经检查的区间，因为区间是按其左端点排序的。 

这`best_idx == -1`check 处理空可用集和每个可用间隔结束不超过`covered`。 由于每个区间都有`b_i >= a_i`，区间满足`a_i <= covered + 1`仅当前缀等于或之前结束时，仍然无法扩展前缀`covered`。 这样的间隔没有任何帮助，因此将其视为非扩展选择是正确的。 

Python 整数具有任意精度，因此上限`m <= 10^9`不会导致溢出问题。 

## 工作示例

 ### 示例 1

 间隔已按其左端点排序。 最初没有覆盖任何内容，因此只有一个从`1`可以选择。 经过考虑，覆盖范围达到`2`。 下一个可用间隔开始于`3`， 等等。 

|`covered`之前的步骤 | 可用间隔| 最佳右端点| 选择的版本 |`covered`步骤后|
 | --- | --- | --- | --- | --- |
 | 0 |`[1,2]`| 2 | 1 | 2 |
 | 2 |`[3,4]`| 4 | 2 | 4 |
 | 4 |`[5,6]`| 6 | 3 | 6 |
 | 6 |`[7,8]`| 8 | 4 | 8 |

 算法达到`m = 8`经过四种选择后，产生`YES`,`4`，以及版本索引`1 2 3 4`。 每个选定的间隔都被迫直接从前一个前缀继续，因此不变量在每一步之后仍然有效。 

### 示例 2

 间隔是`[1,5]`,`[2,7]`,`[3,4]`， 和`[6,8]`。 一开始，前三个区间是可用的，因为它们的左端点最多是`1`仅适用于第一个间隔，因此版本`1`被选择并且覆盖范围达到`5`。 现在每个间隔最多开始`6`可用，包括版本`4`，达到`8`。 

|`covered`之前的步骤 | 此步骤中考虑的间隔 | 最佳右端点| 选择的版本 |`covered`步骤后|
 | --- | --- | --- | --- | --- |
 | 0 |`[1,5]`| 5 | 1 | 5 |
 | 5 |`[2,7]`,`[3,4]`,`[6,8]`| 8 | 4 | 8 |

 结果是两个版本，`1`和`4`。 版本`2`只达到`7`，因此选择它需要另一个版本才能达到`8`。 贪婪的选择避免了额外的购买。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n log n)`| 分拣成本`O(n log n)`，随后的扫描检查每个间隔一次 |
 | 空间|`O(n)`| 区间数组和选定的版本索引最多包含`n`元素|

 和`n <= 200000`，排序在运行时中占主导地位，并且完全在两秒解决方案的预期范围内。 的价值`m`可以大到`10^9`，但该算法从不迭代单个函数，因此大界限对运行时间没有影响。 内存使用量呈线性关系`n`，正好低于 256 MB。 

## 测试用例

 下面的测试助手在内存输入上运行相同的贪婪逻辑并验证返回的版本集，而不是需要一个特定的有效集。 这很重要，因为该问题允许任何最佳解决方案。```python
import sys
import io

def solve_io():
    input = sys.stdin.readline

    n, m = map(int, input().split())
    intervals = []

    for idx in range(1, n + 1):
        a, b = map(int, input().split())
        intervals.append((a, b, idx))

    intervals.sort()

    ans = []
    covered = 0
    i = 0

    while covered < m:
        best_right = covered
        best_idx = -1

        while i < n and intervals[i][0] <= covered + 1:
            a, b, idx = intervals[i]
            if b > best_right:
                best_right = b
                best_idx = idx
            i += 1

        if best_idx == -1:
            print("NO")
            return

        ans.append(best_idx)
        covered = best_right

    print("YES")
    print(len(ans))
    print(*ans)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve_io()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def check(inp: str, out: str) -> bool:
    lines = out.strip().splitlines()
    first = lines[0]

    data = inp.strip().split()
    it = iter(data)
    n = int(next(it))
    m = int(next(it))

    intervals = []
    for idx in range(1, n + 1):
        a = int(next(it))
        b = int(next(it))
        intervals.append((a, b))

    # A small independent greedy check tells us whether coverage is possible
    intervals_sorted = sorted(intervals)
    covered = 0
    i = 0
    possible = True

    while covered < m:
        best = covered

        while i < n and intervals_sorted[i][0] <= covered + 1:
            best = max(best, intervals_sorted[i][1])
            i += 1

        if best == covered:
            possible = False
            break

        covered = best

    if not possible:
        return first == "NO"

    if first != "YES":
        return False

    k = int(lines[1])
    chosen = list(map(int, lines[2].split()))

    if k != len(chosen) or k == 0:
        return False

    if len(set(chosen)) != k:
        return False

    if any(x < 1 or x > n for x in chosen):
        return False

    chosen_intervals = [intervals[x - 1] for x in chosen]
    chosen_intervals.sort()

    covered = 0
    for a, b in chosen_intervals:
        if a > covered + 1:
            return False
        covered = max(covered, b)

    return covered >= m

# Provided samples
sample1 = """\
4 8
1 2
3 4
5 6
7 8
"""
assert check(sample1, run(sample1)), "sample 1"

sample2 = """\
4 8
1 5
2 7
3 4
6 8
"""
assert check(sample2, run(sample2)), "sample 2"

sample3 = """\
3 8
1 3
4 5
6 7
"""
assert check(sample3, run(sample3)), "sample 3"

# Minimum-size input
case4 = """\
1 1
1 1
"""
assert check(case4, run(case4)), "minimum-size case"

# All intervals equal
case5 = """\
5 10
1 10
1 10
1 10
1 10
1 10
"""
assert check(case5, run(case5)), "all-equal intervals"

# Exact boundary connection: [1,2] followed by [3,5]
case6 = """\
2 5
1 2
3 5
"""
assert check(case6, run(case6)), "exact covered+1 boundary"

# Gap at function 3
case7 = """\
3 5
1 2
4 5
1 1
"""
assert check(case7, run(case7)), "gap case"

# Large n with a single interval covering everything
case8 = "200000 1000000000\n" + "1 1000000000\n" * 200000
assert check(case8, run(case8)), "maximum-n case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 1 1`|`YES`, 一个版本 | 最小值和最小可能覆盖范围|
 | 五份`[1,10]`|`YES`, 一个版本 | 重复和全等间隔 |
 |`[1,2]`,`[3,5]`|`YES`，两个版本| 正确使用`covered + 1`边界|
 |`[1,2]`,`[4,5]`,`[1,1]`|`NO`| 检测真正未发现的功能|
 |`200000`的副本`[1,10^9]`|`YES`, 一个版本 | 最大限度`n`和大`m`无需迭代函数 |

 ## 边缘情况

 ### 第一个可用间隔必须达到函数 1

 考虑```
2 5
2 5
1 1
```最初`covered = 0`，所以条件是`a_i <= 1`。 版本`2`,`[1,1]`，是唯一可用的区间，并将覆盖范围扩展到`1`。 下一个可用间隔是`[2,5]`，开始于`covered + 1 = 2`，因此覆盖范围达到`5`。 算法输出`YES`有两个版本。 在这种情况下，在不首先检查连接性的情况下选择具有最大右端点的间隔的策略将失败。 

### 真正的差距一定会产生NO

 对于```
2 5
1 2
4 5
```第一步选择`[1,2]`, 给予`covered = 2`。 下一个间隔开始于`4`，而下一个所需的函数是`3`。 自从`4 > 2 + 1`，没有区间可以覆盖函数`3`， 和`best_idx`保持未设置状态。 算法立即输出`NO`。 

### 正好从下一个函数开始有效

 对于```
2 5
1 2
3 5
```第一个区间产生`covered = 2`。 第二个区间有`a = 3`, 满足`a <= covered + 1`。 它被选中并将覆盖范围扩大到`5`。 答案是`YES`有两个版本。 使用`a <= covered`相反会错误地拒绝这个有效的案例。 

### 不应选择不扩展覆盖范围的区间

 假设```
3 6
1 3
2 3
4 6
```选择后`[1,3]`, 下一个区间`[2,3]`技术上是合格的，因为`2 <= 4`，但它不会增加覆盖前缀。 算法记录它但离开`best_right = 3`因为它的端点并不大。 然后`[4,6]`也符合资格并成为最佳选择，将覆盖范围扩大到`6`。 多余的`[2,3]`从未被购买过。 

这个细节很有用，因为资格和有用性是不同的概念。 间隔可以与当前前缀重叠而不扩展它，并且这样的间隔不能算作进度。 

### 重叠间隔需要最远端点

 对于```
4 8
1 3
2 5
4 7
6 8
```第一步只考虑`[1,3]`， 所以`covered`变成`3`。 下一步可以使用`[2,5]`，达到`5`。 从那里`[4,7]`可用并达到`7`， 其次是`[6,8]`。 该算法选择四个间隔。 

如果替代输入包含`[2,7]`而不是`[2,5]`，贪心算法会立即选择该间隔，因为它到达的距离更远。 这种选择可以消除以后的购买。 交换参数保证选择最远的可到达端点永远不会增加随后所需的最小间隔数。
