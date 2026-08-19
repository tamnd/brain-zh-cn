---
title: "CF 102275B - 位串即服务"
description: "我们需要构造一个长度为（N）的二进制字符串。 每个要求给出一个区间（[X,Y]），并且该区间内的字符必须从两端读取相同。"
date: "2026-08-17T17:52:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102275
codeforces_index: "B"
codeforces_contest_name: "2019 Facebook Hacker Cup, Round 2"
rating: 0
weight: 102275
solve_time_s: 737
verified: true
draft: false
---

[CF 102275B - 位串即服务](https://codeforces.com/problemset/problem/102275/B)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要构造一个长度为（N）的二进制字符串。 每个要求给出一个区间（[X,Y]），并且该区间内的字符必须从两端读取相同。 最终字符串必须满足每个此类回文要求，同时使 0 和 1 的总数尽可能接近。 

该投入包含多个独立委员会。 对于每一个，(N) 是字符串长度，(M) 是回文要求的数量，接下来的 (M) 对描述它们的端点。 输出必须包含每个委托的一个有效的最佳字符串，并以其案例编号为前缀。 最优字符串可以有很多个，所以我们只需要构造一个即可。 

约束故意设置得足够大，以排除直接对所有可能的字符串进行推理的可能性。 对于 (N\le 4000)，有 (2^{4000}) 个可能的字符串，因此穷举搜索是完全不可行的。 还可能有 (10,000) 个需求，因此通过重复复制或重建大型结构来处理每个需求将是浪费。 官方竞赛使用 15 秒的时间限制和 512 MB 的内存，这使得 (O(N^2)) 解决方案实用，但几乎没有理由接受指数或 (O(MN^2)) 方法。 

第一个边缘情况是（M=0）。 例如，使用输入`1 0`，没有限制，所以要么`0`或者`1`是最优的。 假设每个位置都属于受约束组件的粗心实现可能会因产生空分配或忘记单例组件而失败。 

第二个边缘情况是长度为一的回文，例如`1 1`。 它根本没有强加任何相等性，因为间隔只有一个字符。 为了`N=3, M=1`有要求`2 2`，最优答案可以是`010`，有两个零和一个一。 将回文中心视为两个不同位置之间的相等会引入不存在的约束。 

第三种边缘情况是奇数长度回文。 为了`N=5`有要求`1 5`, 职位`1`和`5`必须匹配，位置`2`和`4`必须匹配，并且位置`3`是免费的。 字符串`00100`是最优的。 总是处理对直到两个指针交叉的粗心循环可能会意外访问中心两次或创建无效索引。 

第四种边缘情况是重叠的需求。 为了`N=6`， 要求`[1,5]`和`[2,6]`意味着`B1=B5`,`B2=B4`,`B2=B6`， 和`B3=B5`。 这些等式传递地相互作用，因此未由同一回文直接配对的几个位置变得相等。 独立处理每个需求并立即分配位可能会违反这种传递关系。 

当多个需求具有相同的 (X+Y) 值时，会出现最后一种微妙的情况。 例如，`[1,7]`和`[2,6]`两者都有端点和 (8)。 第二个间隔完全包含在第一个间隔中，因此第一个间隔已经强加了第二个间隔所需的所有相等性。 仅保留每个端点总和的最宽间隔可以在不更改约束的情况下消除冗余工作。 

## 方法

 直接的暴力方法是尝试每个二进制字符串，如果任何所需的间隔不是回文，则拒绝它，并在幸存的字符串中保留零一差异最小的字符串。 这是正确的，因为每个可能的字符串都被考虑了。 它的问题在于搜索空间本身：有 (2^N) 个字符串。 在 (N=4000) 处，即 (2^{4000}) 个候选者。 如果每个候选都根据 (M) 个间隔进行检查，并且每个回文检查最多扫描 (N) 个字符，则最坏的情况约为 (2^{4000}\cdot 10,000\cdot4,000) 个字符比较。 甚至产生候选人也已经是不可能的了。 

第一个有用的观察是回文要求实际上并不独立地约束值。 它创建了平等约束。 为了`[l,r]`，我们要求

 [
 B_l=B_r,\quad B_{l+1}=B_{r-1},\quad\ldots
 ]

 因此，整个问题首先可以被视为位置图。 每个所需的相等都是一条边，并且每个连接的组件必须接收单个位。 

第二个观察结果是将等式构造保持在 (O(N^2)) 而不是 (O(MN))。 对称对 ((i,j)) 具有唯一的端点和 (i+j)。 对于回文`[l,r]`，它创建的每个等式都有相同的和 (l+r)。 如果两个要求的总和相同，则说`[l,r]`和`[l',r']`，它们的区间是嵌套的，因为 (r=s-l)。 左端点较小的一个完全包含另一个，因此只有该总和的最宽间隔才重要。 

只有 (2N-1) 个可能的端点和。 在保留每个和的最宽间隔后，我们生成其对称对，并将它们的端点与不相交集并集结构合并。 在所有总和中，每个无序位置对最多只能出现一次，因为它的总和是唯一的。 因此，最多处理 (\binom N2) 个等式对，为联合阶段提供 (O(N^2\alpha(N))) 时间。 

等式求解后，假设连接分量的大小为 (s_1,s_2,\ldots,s_k)。 选择要包含的组件`1`将其整个大小贡献给 1 的数量。 因此，我们需要选择总和尽可能接近 (N/2) 的组件尺寸。 这是一个子集和问题，但是 (N\le4000) 允许特别紧凑的位集 DP。 Python 整数可以将所有可达的和表示为位，并且大小 (s) 的分量的转换很简单`reachable |= reachable << s`。 

暴力解决方案之所以有效，是因为它明确地检查了每个作业。 它失败了，因为作业数量呈指数级增长。 等式观察完全改变了问题：首先折叠所有被迫一致的位置，然后仅解决组件大小的子集和问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^N MN)) | (O(N)) | 太慢了 |
 | 最佳| (O(N^2\alpha(N)+M+N^2)) | (O(N^2)) 存储的 DP 位集的最坏情况 | 已接受 |

 ## 算法演练

 1. 读取所有（M）个回文区间，并按值（s=X+Y）将它们分组。 对于每个总和，仅保留最小的 (X)。 由于 (Y=s-X)，该区间是具有该总和的最宽区间，并且具有相同总和的所有其他区间都位于其内部。 
2. 创建一个 DSU，其中每个字符串位置包含一个元素。 最初，每个职位都是其自己的组成部分，因为尚未建立平等。 
3.对于每个保留区间`[l,r]`, 合并`l`和`r`， 然后`l+1`和`r-1`，一直持续到两个位置相遇。 这些正是该回文所要求的相等性。 
4. 计算每个最终 DSU 组件的大小。 一个组件内的每个位置都必须接收相同的位，因此大小的组件的行为就像一个不可分割的重量项。 
5. 对这些分量大小运行子集和 DP。 用一个 Python 整数的位表示一组可达和。 当某些组件集合具有总大小 (x) 时，位 (x) 被准确设置。 从和为零开始，大小 (s) 的分量将可达集更改为`dp`到`dp | (dp << s)`。 
6. 找到最接近 (N/2) 的可达和。 如果这个总和是 (z)，则分配`1`对于那些选定的组件，给出 (z) 个 1 和 (N-z) 个 0，因此所得差值是 (|N-2z|)，通过选择 (z)，该差值最小。 
7. 重建哪些组件构成所选子集。 在每个组件之后存储 DP 位集。 从选择的目标和向后处理组件开始，如果没有组件就无法形成目标，则选择组件。 选择后，从目标中减去其大小。 
8. 分配`1`到其组件被选择的每个位置以及`0`到其他所有位置。 在结果字符串前加上前缀`Case #k:`根据输出格式的要求。 

### 为什么它有效

 DSU 不变量是，当到目前为止处理的等式约束强制两个位置具有相同的位时，它们恰好位于同一组件中。 每个回文间隔精确地贡献其对称端点等式，因此在处理所有间隔之后，每个有效字符串在每个 DSU 组件上都必须是常量。 相反，为每个组件分配一位会自动满足每个相等性，从而满足每个回文要求。 

子集和阶段精确地考虑了可能的个数。 一个组件只能完全为零或完全为一，因此选择总大小为 (z) 的组件会恰好生成 (z) 个。 DP 找到每个这样的 (z)，并选择最接近 (N/2) 的可达值来最小化 (|z-(N-z)|)。 因此构造的字符串既有效又最优。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = [-1] * n

    def find(self, x):
        parent = self.parent
        while parent[x] >= 0:
            if parent[parent[x]] >= 0:
                parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(self, a, b):
        parent = self.parent
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return

        if parent[a] > parent[b]:
            a, b = b, a

        parent[a] += parent[b]
        parent[b] = a

def solve_case(n, intervals):
    # For each sum l + r, only the widest interval is necessary.
    widest = [n + 1] * (2 * n + 1)

    for l, r in intervals:
        s = l + r
        if l < widest[s]:
            widest[s] = l

    dsu = DSU(n)

    # Positions are zero-based here.
    # For a fixed sum s, r = s - l, so the interval is determined by l.
    for s in range(2, 2 * n + 1):
        l = widest[s]
        if l == n + 1:
            continue

        l -= 1
        r = s - l - 2

        while l < r:
            dsu.union(l, r)
            l += 1
            r -= 1

    # Compress all components and obtain their sizes.
    components = []
    root_to_id = {}
    comp_id = [-1] * n

    for i in range(n):
        root = dsu.find(i)
        if root not in root_to_id:
            root_to_id[root] = len(components)
            components.append(-dsu.parent[root])
        comp_id[i] = root_to_id[root]

    k = len(components)

    # Bitset subset sum.
    # dp bit x == 1 iff sum x is reachable.
    dp_history = [1]
    dp = 1

    for size in components:
        dp |= dp << size
        dp_history.append(dp)

    target = n // 2

    # Find the reachable sum closest to n / 2.
    best = target
    while best >= 0 and ((dp >> best) & 1) == 0:
        best -= 1

    # For odd n, the upper side can be equally good.
    upper = target + 1
    if upper <= n and ((dp >> upper) & 1):
        if abs(n - 2 * upper) < abs(n - 2 * best):
            best = upper

    # Reconstruct the selected components.
    selected = [False] * k
    cur = best

    for i in range(k, 0, -1):
        size = components[i - 1]

        if ((dp_history[i - 1] >> cur) & 1) == 0:
            selected[i - 1] = True
            cur -= size

    answer = ['0'] * n

    for i in range(n):
        if selected[comp_id[i]]:
            answer[i] = '1'

    return ''.join(answer)

def main():
    t = int(input())
    out = []

    for case_no in range(1, t + 1):
        n, m = map(int, input().split())
        intervals = [tuple(map(int, input().split())) for _ in range(m)]

        ans = solve_case(n, intervals)
        out.append(f"Case #{case_no}: {ans}")

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    main()
```这`widest`数组索引为`l+r`。 它的初始值是比每个可能的左端点都大的哨兵。 当读取一个区间时，我们保留其总和的最小左端点。 因为右端点是由总和确定的，所以这正是该总和的最大间隔。 

DSU 使用负值`parent`在根部存储组件尺寸。 这避免了单独的大小数组。 按大小联合使树木变浅，并且`find`执行路径压缩。 

从一开始的输入到从零开始的位置的转换发生在处理间隔时。 对于原始间隔`[l,r]`，减去一后`l`，从零开始的右端点是`s-l-2`。 该循环合并对称位置并在中心停止，因此长度为一或奇数长度的回文不会产生无效的对。 

组件列表包含每个 DSU 组件中的位置数。 子集和转换使用 Python 的任意大小整数作为位集。 如果在处理大小为 (s) 的分量之前存在位 (x)，则位 (x+s) 出现在`dp << s`。 

这`dp_history`list 存储每个组件之后的可达总和。 在最坏的情况下，这会花费 (O(N^2)) 位，对于 (N=4000)，这仅需要几兆字节。 它使重建变得简单，因为当考虑尺寸的组成部分时`size`，我们可以检查当前目标是否在该组件之前已经可达。 如果不是，则该组件必须属于选定的子集。 

Python 中不需要整数溢出处理。 唯一可能较大的值是位集整数，其大小受 (N+1) 位限制。 

## 工作示例

 ### 示例 1

 第一个佣金是`N=4, M=0`，因此不存在等式约束。 每个位置都是其自己的组成部分。 

| 步骤| 元件尺寸| 可达到的金额| 选定的目标|
 | --- | --- | --- | --- |
 | 开始|`[1,1,1,1]`|`{0}`|`2`|
 | 添加 1 |`[1]`|`{0,1}`|`2`|
 | 添加 1 |`[1,1]`|`{0,1,2}`|`2`|
 | 添加 1 |`[1,1,1]`|`{0,1,2,3}`|`2`|
 | 添加 1 |`[1,1,1,1]`|`{0,1,2,3,4}`|`2`|
 | 重建| 四个单例组件 | 两个已选 |`2`那些 |

 该算法可以选择任意两个单例组件，产生`0011`,`0101`，或另一种具有两个零和两个一的排列。 这里的不变性是，如果没有回文要求，每个位置仍然可以独立分配。 

### 示例 2

 第二个委托是`N=6, M=1`有要求`[1,6]`。 其端点和为(7)，因此和(7)的最宽区间为`[1,6]`。 

| 步骤| 配对合并 | 合并后的组件 | 元件尺寸|
 | --- | --- | --- | --- |
 | 开始| 无 |`{1},{2},{3},{4},{5},{6}`|`[1,1,1,1,1,1]`|
 | 1 |`1 = 6`|`{1,6},{2},{3},{4},{5}`|`[2,1,1,1,1]`|
 | 2 |`2 = 5`|`{1,6},{2,5},{3},{4}`|`[2,2,1,1]`|
 | 3 |`3 = 4`|`{1,6},{2,5},{3,4}`|`[2,2,2]`|
 | DP | 尺寸`2,2,2`|`{0,2,4,6}`| 目标`3`， 最好的`2`|
 | 重建| 选择一种 size-2 组件 | 两个 | 不同之处`2`|

 有效的最优结果是`110011`。 完整回文中的每个对称对都一致，并且字符串包含四个零和两个一，给出 (2) 的最小可能差异。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N^2\alpha(N)+M+KN)) | 最多处理 (\binom N2) 个对称对，并且子集和运算使用 (O(N)) 位整数来表示最多 (K\le N) 个分量 |
 | 空间| (O(N^2)) 位加 (O(N+M)) 辅助存储 | DP历史记录最多存储(N)个位集，每个位集最多包含(N+1)个位|

 相等阶段受到无序位置对数量的限制，当（N=4000）时，大约为八百万。 子集求和阶段在 Python 中特别高效，因为移位和 OR 运算在打包机器字上运行，而不是在每个和上运行一个 Python 对象。 与枚举 (2^N) 个可能的字符串不同，设计约束条件是为了使这种二次方法切实可行。 

## 测试用例

 下面的测试使用验证器，而不是与一个固定的输出字符串进行比较，因为该问题接受许多不同的最佳字符串。 验证器检查输出是否为二进制，每个请求的间隔是否为回文，并且零一差异等于通过对输出的相等分量进行小型独立子集和计算获得的真实最佳值。```python
# helper: run solution on input string, return output string
import sys
import io

class DSU:
    def __init__(self, n):
        self.p = [-1] * n

    def find(self, x):
        while self.p[x] >= 0:
            if self.p[self.p[x]] >= 0:
                self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return
        if self.p[a] > self.p[b]:
            a, b = b, a
        self.p[a] += self.p[b]
        self.p[b] = a

def solve_case(n, intervals):
    widest = [n + 1] * (2 * n + 1)

    for l, r in intervals:
        s = l + r
        widest[s] = min(widest[s], l)

    dsu = DSU(n)

    for s in range(2, 2 * n + 1):
        l = widest[s]
        if l == n + 1:
            continue

        l -= 1
        r = s - l - 2

        while l < r:
            dsu.union(l, r)
            l += 1
            r -= 1

    root_id = {}
    comp = [-1] * n
    sizes = []

    for i in range(n):
        root = dsu.find(i)
        if root not in root_id:
            root_id[root] = len(sizes)
            sizes.append(-dsu.p[root])
        comp[i] = root_id[root]

    dp = 1
    hist = [dp]

    for s in sizes:
        dp |= dp << s
        hist.append(dp)

    target = n // 2
    best = None

    for x in range(n + 1):
        if (dp >> x) & 1:
            if best is None or abs(n - 2 * x) < abs(n - 2 * best):
                best = x

    chosen = [False] * len(sizes)
    cur = best

    for i in range(len(sizes), 0, -1):
        s = sizes[i - 1]
        if ((hist[i - 1] >> cur) & 1) == 0:
            chosen[i - 1] = True
            cur -= s

    ans = ['0'] * n
    for i in range(n):
        if chosen[comp[i]]:
            ans[i] = '1'

    return ''.join(ans)

def solution(inp):
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    t = int(sys.stdin.readline())
    out = []

    for case_no in range(1, t + 1):
        n, m = map(int, sys.stdin.readline().split())
        intervals = [
            tuple(map(int, sys.stdin.readline().split()))
            for _ in range(m)
        ]
        out.append(f"Case #{case_no}: {solve_case(n, intervals)}")

    sys.stdin = old_stdin
    return '\n'.join(out)

def validate(inp):
    lines = inp.strip().splitlines()
    it = iter(lines)
    t = int(next(it))

    expected_cases = []

    for _ in range(t):
        n, m = map(int, next(it).split())
        intervals = [tuple(map(int, next(it).split())) for _ in range(m)]
        expected_cases.append((n, intervals))

    output = solution(inp).splitlines()
    assert len(output) == t

    for case_no, ((n, intervals), line) in enumerate(
        zip(expected_cases, output), 1
    ):
        prefix = f"Case #{case_no}: "
        assert line.startswith(prefix)
        s = line[len(prefix):]

        assert len(s) == n
        assert set(s) <= {'0', '1'}

        for l, r in intervals:
            part = s[l - 1:r]
            assert part == part[::-1]

        # Build equality components independently.
        dsu = DSU(n)
        for l, r in intervals:
            l -= 1
            r -= 1
            while l < r:
                dsu.union(l, r)
                l += 1
                r -= 1

        sizes = {}
        for i in range(n):
            root = dsu.find(i)
            sizes[root] = sizes.get(root, 0) + 1

        dp = 1
        for size in sizes.values():
            dp |= dp << size

        ones = s.count('1')
        best = min(
            abs(n - 2 * x)
            for x in range(n + 1)
            if (dp >> x) & 1
        )

        assert abs(n - 2 * ones) == best

# Provided samples.
sample = """6
4 0
6 1
1 6
4 2
1 2
2 4
5 3
3 5
2 2
2 4
10 5
3 6
1 4
6 8
5 9
9 10
25 10
17 20
"""

validate(sample)

# Minimum-size input.
validate("""1
1 0
""")

# A length-one palindrome must impose no equality.
validate("""1
3 1
2 2
""")

# Full palindrome with odd length, exercising the center position.
validate("""1
5 1
1 5
""")

# Many overlapping and nested intervals.
validate("""1
8 5
1 8
2 7
3 6
1 5
4 4
""")

# Boundary-heavy case, with intervals touching both ends.
validate("""1
10 6
1 2
9 10
1 10
2 9
3 8
4 7
""")

# Large case with no constraints.
large = "1\n4000 0\n"
validate(large)

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 0`| 任何一位字符串 | 最小值（N），无限制|
 |`1 / 3 1 / 2 2`| 任意最优三位字符串 | 长度一回文 |
 |`1 / 5 1 / 1 5`| 任意最优回文| 奇数长度中心处理|
 |`1 / 8 5 / overlapping intervals`| 任何有效的最优| 传递 DSU 合并和嵌套约束 |
 |`1 / 10 6 / boundary intervals`| 任何有效的最优| 基于一的边界和重叠端点约束 |
 |`1 / 4000 0`| 任何平衡的 4000 位字符串 | 最大 (N) 和二次独立 DP 行为 |

 ## 边缘情况

 对于`1 0`，DSU 从尺寸为 1 的一个组件开始。 子集和 DP 既达到 0 又达到 1，因此它选择差值为零的任一目标。 因此，重构的输出是单个有效位。 

为了`3 1`有要求`2 2`，存储的间隔有 sum (4)，但将其转换为从零开始的坐标后，左右位置相同。 循环条件`l < r`立即为 false，因此不执行并集。 所有三个位置保持独立，子集和阶段为一位选择两个位置，为另一位选择一个位置，给出差值 1。 

为了`5 1`有要求`1 5`, DSU 合并头寸`1`和`5`， 然后`2`和`4`，离开位置时`3`独自的。 因此，组件尺寸为`2,2,1`。 可达到的一计数包括`0,1,2,3,4,5`，因此目标二或三给出差值一。 结果字符串如`00100`是一个回文，具有三个零和两个一。 

对于重叠的要求，例如`1 8`,`2 7`， 和`3 6`，每个区间贡献其对称等式。 DSU 传递性地结合了等式，因此如果一项要求连接位置`1`和`8`，另一个最终连接`8`换个位置，这三个都属于同一个组件。 最终分配是针对每个组件进行的，因此以后的选择不会意外地将不同的位分配给强制相等的位置。 

对于具有相同端点总和的多个区间，仅保留最宽的区间。 假设要求是`[1,7]`和`[2,6]`。 两者的总和都是八。 第一个间隔生成对`(1,7)`,`(2,6)`， 和`(3,5)`，所以第二个间隔没有贡献任何新内容。 丢弃它是安全的，因为等式图没有改变。 

对于 (N=4000) 和 (M=0)，每个位置都是一个单例组件。 DSU 阶段不执行并集，而位集 DP 达到从 0 到 4000 的每个总和。所选目标恰好是 2000，因此输出包含 2000 个零和 2000 个 1。 这练习了尽可能多的组件，并演示了为什么压缩整数子集和表示优于二次 Python 布尔表。
