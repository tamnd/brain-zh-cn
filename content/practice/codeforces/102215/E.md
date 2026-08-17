---
title: "CF 102215E - 第三方软件 - 2"
description: "有 (m) 个连续函数，编号从 (1) 到 (m)。 每个库版本都可以访问这些函数的一个连续区间，从 (ai) 到 (bi)。"
date: "2026-08-17T23:39:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102215
codeforces_index: "E"
codeforces_contest_name: "2019, XII Samara Regional Intercollegiate Programming Contest"
rating: 0
weight: 102215
solve_time_s: 285
verified: false
draft: false
---

[CF 102215E - 第三方软件 - 2](https://codeforces.com/problemset/problem/102215/E)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 45s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 有 (m) 个连续函数，编号从 (1) 到 (m)。 每个库版本都可以访问这些函数的一个连续区间，从 (a_i) 到 (b_i)。 Pavel 可以购买任何版本的集合，并且它们的区间的并集必须包含从 (1) 到 (m) 的每个函数。 

该任务有两个部分。 首先，确定这样的集合是否存在。 如果存在，找到版本数量尽可能少的集合并打印其原始索引。 

大约束是 (n \le 200000)，而 (m) 可以大到 (10^9)。 这立即排除了任何迭代所有 (m) 函数的情况，因为 (m) 本身可能比 (n) 大得多。 它还排除了枚举版本子集，因为 (2^{200000}) 远远超出了任何实际限制。 (O(n^2)) 解决方案在这种规模下也太慢，因为它可以执行大约 (4\cdot10^{10}) 间隔比较。 排序后我们需要一个 (O(n\log n)) 或理想情况下 (O(n)) 的算法。 

间隔是闭合的，因此相邻间隔连接时没有间隙。 例如，([1,3]) 和 ([4,7]) 一起涵盖从 (1) 到 (7) 的每个整数。 如果粗心的实现要求下一个间隔最多从当前右端点开始，则会错误地拒绝这种情况。 

考虑输入```
2 7
1 3
4 7
```正确的输出开始于`YES`并且需要两个版本。 第二个区间从 (4) 开始，但函数 (4) 正是 (1,2,3) 之后的下一个未覆盖函数，因此不存在间隙。 

另一个微妙的情况是间隔开始得太晚：```
2 8
1 3
5 8
```正确的输出是```
NO
```因为函数（4）未被发现。 仅检查最终右端点是否达到 (m) 的实现可能会错误地接受这些间隔。 

第三种边缘情况是一个区间已经涵盖了所有内容：```
3 8
1 8
3 5
6 7
```正确答案仅使用一个版本，即版本 (1)。 对参与某些可能覆盖的所有间隔进行计数将产生非最小答案。 

最后，多个间隔可以从同一位置开始，并且应优先选择具有最大右端点的间隔：```
4 10
1 3
1 6
2 4
6 10
```最佳答案使用版本（2）和（4）。 首先选择版本（1）仍然允许解决方案，但一般来说它不是一个安全的贪婪选择。 在每个点上，我们都需要将当前覆盖范围扩展至最远的间隔。 

## 方法

 直接的暴力方法是考虑 (n) 个库版本的每个子集。 对于每个子集，我们可以收集其区间，对它们进行排序或扫描，并检查它们的并集是否涵盖从 (1) 到 (m) 的整个范围。 我们可以记住最小的有效子集。 这是正确的，因为每个可能的购买决策都出现在子集中，因此最佳有效子集必然是最优的。 

问题是子集的数量。 它们有 (2^n) 个，检查一个子集可能需要 (O(n)) 的工作。 在最坏的情况下，这会产生 (O(n2^n)) 次操作。 即使忽略 (n) 因素，(2^{200000}) 也比两秒时间限制内可以容纳的操作数量大得难以想象。 

有用的结构是每个版本都提供一个间隔。 为了覆盖函数的前缀，我们只关心我们选择的间隔当前到达右侧多远。 假设函数 (1) 到 (r) 已经被涵盖。 任何有用的下一个间隔必须在 (r+1) 或之前开始，因为 (r+1) 之后开始的间隔会留下间隙。 

在所有可以扩展当前覆盖范围的区间中，选择具有最大右端点的区间总是至少与选择较早结束的区间一样好。 它涵盖了较短间隔所涵盖的所有内容，甚至可能更多。 这将问题转化为经典的最小区间覆盖问题。 

按左端点对间隔进行排序后，我们可以从左到右处理它们。 在每个阶段，维护左端点已可达的所有间隔中最远的右端点。 选择到达最远端点的间隔，然后重复。 如果没有可到达的间隔可以扩展覆盖范围，则存在间隙并且答案是不可能的。 

键贪婪选择是最优的，因为扩展当前前缀的任何有效解决方案都必须使用某个不晚于下一个未覆盖函数开始的区间。 用具有最远右端点的可达区间替换该区间不会使剩下的问题变得更加困难。 因此，贪婪选择永远不会使用比最优解更多的间隔。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n2^n)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 将每个间隔及其原始版本号存储在一起，然后按左端点对间隔进行排序。 排序使我们能够发现随着覆盖前缀的增长而变得可用的所有间隔，而无需重复扫描整个输入。 
2. 开始于`covered = 0`。 这意味着函数 (1) 到`covered`目前已涵盖，因此下一个必须涵盖的功能是`covered + 1`。 
3. 扫描排序后的区间，其左端点最多为`covered + 1`。 在这些可到达的区间中，记住具有最大右端点的区间。 这样的间隔是最强的可能的下一个选择，因为它尽可能地扩展了覆盖的前缀。 
4. 如果没有间隔可以扩展当前覆盖范围，则停止并打印`NO`。 每个剩余间隔开始于`covered + 1`，所以函数`covered + 1`永远不能被任何未选择的区间覆盖。 
5. 否则，选择记住的区间，将其原始索引附加到答案中，然后设置`covered`到它的右端点。 新覆盖的前缀可能会使额外的间隔可达，因此从当前位置继续扫描。 
6. 重复直到`covered >= m`。 此时，从 (1) 到 (m) 的每个函数都被覆盖，并且所选索引形成有效的解决方案。 
7. 打印`YES`、所选版本的数量及其原始索引。 

### 为什么它有效

 不变的是，在每次贪婪选择之前，从 (1) 到 (1) 的所有函数`covered`被覆盖，并且左端点最多为的每个区间`covered + 1`已被视为可能的下一个间隔。 

假设最优解扩展了当前覆盖的前缀。 其下一个选定的间隔必须开始于不晚于`covered + 1`，否则第一个未覆盖的函数将保持未覆盖状态。 贪心算法检查所有此类间隔并选择右端点最大的间隔。 用贪婪区间替换最优解的下一个区间并不能减少覆盖前缀，因为贪婪区间至少能达到同样远。 因此，最优解决方案的其余部分仍然足够，或者很快就变得不必要。 

通过重复进行这种交换，从每个贪婪选择开始都存在一个最优解决方案。 相同的论点适用于每个后续步骤，因此完整的贪婪解决方案使用尽可能少的版本数。 如果算法在到达 (m) 之前卡住，则不存在能够覆盖下一个函数的区间，因此不存在有效的解。 

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
    pos = 0

    while covered < m:
        best_right = covered
        best_idx = -1

        while pos < n and intervals[pos][0] <= covered + 1:
            a, b, idx = intervals[pos]
            if b > best_right:
                best_right = b
                best_idx = idx
            pos += 1

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
```输入存储为`(a, b, idx)`， 在哪里`idx`是原始版本号。 按元组排序自然主要是按`a`，这正是贪婪扫描所需要的。`covered`代表已经保证被覆盖的最右边的函数。 最初它为零，因此如果区间的左端点至多为 (1)，则该区间可用。 在将覆盖范围扩展到（7）之后，从（8）开始的区间也是可用的，因为可以连续覆盖函数（1）到（8）。 

内循环消耗当前阶段可到达左端点的每个间隔。 他们之中，`best_right`记录最右端点。 稍后无需重新考虑间隔。 一旦其左端点可达，它就永远保持可达状态，如果它不是此阶段的最佳选择，则后面的贪婪阶段无法使其比已选择的用于扩展覆盖范围的间隔更好。 

严格比较`b > best_right`就足够了。 如果两个间隔到达相同的端点，则其中任何一个都给出完全相同的覆盖范围，因此任一原始索引都是有效的。 

间隙检查表示为`best_idx == -1`。 如果没有可到达的间隔扩展当前前缀，则无法到达下一个未覆盖的函数。 这比仅检查某个间隔是否存在要强，因为从`covered + 2`或以后无法桥接缺失的功能。 

Python 中不存在整数溢出问题，而且 (m) 的最大值与 Python 的整数范围相比还是很小。 表达式`covered + 1`也是正确的边界，因为区间是包含在内的。 

## 工作示例

 ### 示例 1

 输入包含四个不相交的区间，它们精确地划分了所需的范围。 

| 迭代|`covered`之前| 可达到的间隔| 选择的版本 |`covered`之后|
 | ---| ---| ---| ---| ---|
 | 1 | 0 |`[1,2]`| 1 | 2 |
 | 2 | 2 |`[3,4]`| 2 | 4 |
 | 3 | 4 |`[5,6]`| 3 | 6 |
 | 4 | 6 |`[7,8]`| 4 | 8 |

 在第一次迭代时，只有版本 (1) 可以覆盖函数 (1)。 选择后，函数（3）成为下一个未覆盖的函数，因此版本（2）变得可达。 继续相同的过程，直到覆盖整个范围。 

结果是`YES`，有四个选定的版本。 由于每个间隔都需要桥接范围的新部分，因此任何解决方案都不能使用少于四个的间隔。 

### 示例 2

 这里的间隔是```
1: [1,5]
2: [2,7]
3: [3,4]
4: [6,8]
```排序的顺序已经是输入顺序。 

| 迭代|`covered`之前| 可达到的间隔| 最佳终点 | 选择的版本 |`covered`之后|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 0 |`[1,5]`| 5 | 1 | 5 |
 | 2 | 5 |`[2,7]`| 7 | 2 | 7 |
 | 3 | 7 |`[6,8]`| 8 | 4 | 8 |

 这条痕迹暴露了一个重要的细节。 版本（2）在第一次迭代时已被考虑，但无法选择，因为它的左端点是（2），而功能（1）尚未覆盖。 一旦版本 (1) 覆盖到 (5)，版本 (2) 就变得可访问并将覆盖范围扩展到 (7)。 

得到的贪心解实际上是版本(1,2,4)，它使用了三个版本。 但是，示例输出使用版本 (1,4)，因为版本 (1) 涵盖到 (5)，而版本 (4) 从 (6) 开始并到达 (8)。 如果仅因为版本 (2) 到达更远而选择版本 (2)，则这会揭示上面跟踪中的缺陷。 

正确的贪心算法必须选择最远的可达端点，因此它确实会先选择版本（1），到达（5），然后选择版本（2），到达（7），从而产生三个版本。 这与样本声称的两个版本的答案相矛盾。 原因是样本的版本 (4) 是`[6,8]`，因此版本 (1) 和 (4) 涵盖`[1,5]`和`[6,8]`，这是有效的。 因此，如果样本答案打算是，则所陈述的问题不能使用标准最小区间覆盖解释，并且区间与提供的区间完全相同。`2`。 

对于所写的问题，正确的贪婪标准是基于选择其并集覆盖整个函数范围的区间，并且仅当目标和覆盖语义与该公式匹配时，才应在构建最小覆盖时通过按正确端点对区间进行排序来应用标准贪婪算法。 给定提供的样本，预期的答案表明选择`[1,5]`其次是`[6,8]`是有效的，而普通的最远贪心会选择`[2,7]`后`[1,5]`。 

这种不一致意味着提供的语句和示例数据不足以证明上述标准贪婪解决方案的合理性。 正确的社论必须使用原始 Codeforces 问题的确切预期语义，而不是仅从复制的语句中推断它们。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log n)) | 对 (n) 个间隔进行排序主导扫描，每个间隔处理一次。 |
 | 空间| (O(n)) | (O(n)) | 间隔和选定的版本索引被显式存储。 |

 对于（n=200000），排序大约需要几百万次比较的规模，然后是线性扫描。 这适用于优化的竞争性编程环境中的两秒限制。 (m) 的值可以达到 (10^9)，但算法从不迭代单个函数，因此 (m) 的大小不会影响运行时间。 

## 测试用例

 由于提供的样本 2 与普通的区间覆盖贪婪公式不一致，因此下面的测试使用指定的解释，即所选闭区间的并集必须覆盖从 (1) 到 (m) 的每个函数。 帮助器验证返回的集合，而不需要一组精确的索引，因为可能存在多个不同的最佳答案。```python
import sys
import io

def solve_data(inp: str) -> str:
    data = inp.strip().split()
    it = iter(data)

    n = int(next(it))
    m = int(next(it))

    intervals = []
    for idx in range(1, n + 1):
        a = int(next(it))
        b = int(next(it))
        intervals.append((a, b, idx))

    intervals.sort()

    ans = []
    covered = 0
    pos = 0

    while covered < m:
        best_right = covered
        best_idx = -1

        while pos < n and intervals[pos][0] <= covered + 1:
            a, b, idx = intervals[pos]
            if b > best_right:
                best_right = b
                best_idx = idx
            pos += 1

        if best_idx == -1:
            return "NO\n"

        ans.append(best_idx)
        covered = best_right

    return "YES\n{}\n{}\n".format(len(ans), " ".join(map(str, ans)))

def validate(inp: str, out: str):
    lines = out.strip().splitlines()
    assert lines, "empty output"

    data = inp.strip().split()
    it = iter(data)
    n = int(next(it))
    m = int(next(it))

    intervals = []
    for idx in range(1, n + 1):
        a = int(next(it))
        b = int(next(it))
        intervals.append((a, b))

    if lines[0] == "NO":
        # Verify independently with the same reachability criterion.
        intervals2 = sorted((a, b) for a, b in intervals)
        covered = 0
        pos = 0

        while covered < m:
            best = covered
            while pos < n and intervals2[pos][0] <= covered + 1:
                best = max(best, intervals2[pos][1])
                pos += 1
            if best == covered:
                return
            covered = best

        raise AssertionError("reported NO for a coverable instance")

    assert lines[0] == "YES"
    k = int(lines[1])
    chosen = list(map(int, lines[2].split()))

    assert len(chosen) == k
    assert len(set(chosen)) == k
    assert all(1 <= x <= n for x in chosen)

    selected = [intervals[x - 1] for x in chosen]
    selected.sort()

    covered = 0
    for a, b in selected:
        assert a <= covered + 1
        covered = max(covered, b)

    assert covered >= m

    # Verify minimality by computing the greedy optimum independently.
    all_intervals = sorted(
        (a, b, idx) for idx, (a, b) in enumerate(intervals, 1)
    )

    optimum = 0
    covered = 0
    pos = 0

    while covered < m:
        best = covered

        while pos < n and all_intervals[pos][0] <= covered + 1:
            best = max(best, all_intervals[pos][1])
            pos += 1

        assert best > covered
        covered = best
        optimum += 1

    assert k == optimum

def run(inp: str) -> str:
    return solve_data(inp)

sample1 = """\
4 8
1 2
3 4
5 6
7 8
"""
validate(sample1, run(sample1))

# The ordinary interval-covering interpretation gives 3 here:
# [1,5], [2,7], [6,8].
sample2 = """\
4 8
1 5
2 7
3 4
6 8
"""
validate(sample2, run(sample2))

sample3 = """\
3 8
1 3
4 5
6 7
"""
validate(sample3, run(sample3))

# Minimum-size case: one version already covers everything.
case4 = """\
1 1
1 1
"""
validate(case4, run(case4))

# All intervals are identical. Only one is needed.
case5 = """\
5 10
1 10
1 10
1 10
1 10
1 10
"""
validate(case5, run(case5))

# Boundary adjacency: [1,3] and [4,6] touch exactly.
case6 = """\
2 6
1 3
4 6
"""
validate(case6, run(case6))

# Gap at function 4.
case7 = """\
3 7
1 3
5 7
2 2
"""
assert run(case7).strip() == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 1 1`|`YES`, 一个版本 | 最小输入，完成单次区间 |
 | 五份`[1,10]`|`YES`, 一个版本 | 重复间隔和最小基数 |
 |`[1,3]`,`[4,6]`|`YES`，两个版本| 包容端点和邻接|
 |`[1,3]`,`[5,7]`,`[2,2]`|`NO`| 真正的裸露功能和间隙检测|

 验证器故意不逐字比较版本索引。 如果两个版本给出相同的最佳覆盖范围，则任一版本都是有效答案。 相反，它检查报告的间隔是否覆盖整个范围，以及报告的数量是否等于独立计算的贪婪最优值。 

## 边缘情况

 邻接情况```
2 6
1 3
4 6
```开始于`covered = 0`。 第一个区间是可达的，因为它的左端点是 (1)，因此覆盖范围变为 (3)。 第二个区间有左端点 (4 = Covered + 1)，因此它也是可达的。 覆盖率变为 (6)，算法打印`YES`有两个版本。 中的平等`a <= covered + 1`在这里至关重要。 替换为`a <= covered`会错误地报告`NO`。 

差距案例```
3 7
1 3
5 7
2 2
```首先选择`[1,3]`，因为它是唯一能够扩展函数 (1) 覆盖范围的区间。 下一个必需的函数是 (4)。 间隔`[2,2]`已被考虑且无法扩大覆盖范围，而`[5,7]`开始太晚了。 没有区间可以覆盖函数 (4)，所以`best_idx`遗迹`-1`并且算法正确打印`NO`。 

对于相同的间隔，```
5 10
1 10
1 10
1 10
1 10
1 10
```所有五个间隔在初始步骤中都是可达的，但它们都以 (10) 结束。 该算法仅选择遇到的第一个间隔，因为后面的间隔没有严格更大的右端点。 覆盖范围立即达到 (10)，因此答案恰好包含一个版本。 

对于尽可能最小的实例，```
1 1
1 1
```初始所需函数为(1)，唯一区间可达，其右端点为(1)。 循环在一项选择后立即终止。 这会检查初始边界`covered = 0`和停止条件`covered >= m`。 

然而，所提供的示例 2 存在一个根本问题。根据提示中所述的区间并集解释，区间`[1,5]`,`[2,7]`,`[3,4]`， 和`[6,8]`最小覆盖三个间隔，而不是最远到达前缀贪婪算法下的两个，而样本声称版本`1`和`4`够了。 自从`[1,5]`和`[6,8]`确实涵盖了从 (1) 到 (8) 的所有整数，实际最小值最多为 2，而正确的最小值恰好为 2。 因此，这篇社论中描述的标准贪婪对于所提供的示例来说是不正确的。 

这种矛盾无法通过改变实施细节来修复`<`到`<=`。 必须修改贪婪，以考虑到以下事实：在所有当前可到达的间隔中选择具有最远右端点的间隔可以使用比创建更好的边界对齐的不同选择更多的版本。 因此，提示中提供的陈述和示例并未描述所提供的标准贪心法是有效解决方案的问题。 值得信赖的 Codeforces 社论在没有首先解决原始问题定义中的差异的情况下，不应呈现该精确样本集所接受的算法。
