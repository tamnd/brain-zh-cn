---
title: "CF 102448B - 贝扎的宿醉"
description: "夜晚可以看作是 N 个位置的数组。 位置 i 存储第 i 小时内饮用的 Beza 饮料。 酒吧提供M种饮品名称，每个名称都有相关的酒精量。 类型 1 查询将一个数组位置更改为另一种饮料。"
date: "2026-08-12T08:20:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102448
codeforces_index: "B"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2020"
rating: 0
weight: 102448
solve_time_s: 172
verified: true
draft: false
---

[CF 102448B - 贝扎的宿醉](https://codeforces.com/problemset/problem/102448/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 夜晚可以看作是 N 个位置的数组。 位置 i 存储第 i 小时内饮用的 Beza 饮料。 酒吧提供M种饮品名称，每个名称都有相关的酒精量。 

类型 1 查询将一个数组位置更改为另一种饮料。 类型 2 查询询问连续子数组 [L,R]：在这些时间内消耗的酒精总量是否足以导致宿醉？ 

假设间隔包含 K=R−L+1 小时。 Beza 喝酒的时间为 60K 分钟，因此不会引起宿醉的最大酒精量是其一半，即 30K。 因此，答案是`YES`恰好在什么时候

 i=L Σ R ​ V i ​ >30(R−L+1),

 其中 Vi ​ 是当前饮料在位置 i 处的酒精含量。 平等给予`NO`，因为等于限制的金额仍然是安全的。 

前 N 个饮料名称描述了初始数组。 接下来的M行构成了一个从饮料名称到酒精量的字典。 然后有Q个动态操作。 相关量都可以大到 2⋅10 5 ，因此在最坏的情况下，扫描每个查询的整个区间可能需要大约 NQ=4⋅10 10 个元素访问。 这远远超出了 2 秒的限制。 我们需要每次更新和查询的对数工作。 

有一些边界情况可能会悄悄地导致错误的答案。 首先，一小时的间隔必须使用正好为 30 的阈值，而不是 60。例如，```
1 1 1
a
a 31
2 1 1
```有输出`YES`，因为 31>30。 与 60(R−L+1) 进行比较的解决方案将错误地打印`NO`。 

平等案例也很重要。 考虑```
1 1 1
a
a 30
2 1 1
```输出是`NO`，因为 30 升正是允许的量。 粗心的实现使用`>=`而不是`>`会错误地报告宿醉。 

更新必须立即影响后续查询。 例如，```
2 2 3
a a
a 30
b 100
1 1 b
2 1 1
```产生```
YES
```因为位置 1 变成`b`，其值为 100。使用原始数组而不是当前数组将错误地回答`NO`。 

最后，区间的两个端点都属于查询。 和```
2 2 1
a b
a 30
b 31
2 1 2
```总数是 61，而阈值是 60，所以答案是`YES`。 不小心查询半开区间如 [L,R) 会错过位置 R 处的饮料。 

## 方法

 直接的解决方案是将每种饮料名称转换为其酒精值并将这些值存储在数组中。 对于类型 1 查询，我们替换一个数组元素。 对于类型 2 查询，我们从 L 到 R 循环，添加所有值，并将结果与​​ 30(R−L+1) 进行比较。 这是正确的，因为查询精确地要求该间隔内当前值的总和。 

问题是范围查询的成本。 一个查询可以检查 N 个元素，而使用 Q 个查询时，最坏情况是 O(NQ)。 当 N=Q=200000 时，在考虑其他操作之前，最多可访问 40,000,000,000 次数组。 2 秒的限制排除了这种方法。 

有用的观察结果是，每个类型 2 查询只需要一个范围总和，而每个类型 1 查询只更改一个值。 这正是 Fenwick 树处理的操作模式。 Fenwick 树存储部分和，因此点更改和前缀和都需要 O(logN) 时间。 一旦前缀和可用，[L,R] 的总和即可获得：`prefix(R) - prefix(L-1)`。 

关键的减少是将宿醉条件重写为两个相加量之间的比较。 我们可以在数据结构中只存储酒精值，并直接将阈值计算为 30(R−L+1)，而不是单独考虑分钟。 将名称转换为值后，不需要有关饮料的其他信息。 

暴力破解之所以有效，是因为直接对间隔求和可以准确地给出所需的数量，但当查询许多长间隔时就会失败。 只需要点变化和范围总和的观察结果让我们可以用芬威克树代替重复扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 最坏情况 | O(NQ) O(N+M) | 太慢了|
 | 最佳| O((N+M+Q)logN) | O((N+M+Q)logN) | O(N+M) | 已接受 |

 ## 算法演练

 1. 读取初始饮料名称和 M 饮料值。 存储从每个名称到其酒精含量的映射，因为查询通过名称引用饮料。 
2. 将初始时间表中的每杯饮料转换为其酒精含量的数字。 将数值保留在数组中可以避免在处理查询时重复字典查找。 
3. 在生成的数组上构建 Fenwick 树。 该树表示前缀和，它允许我们通过减去两个前缀和来获得任何区间和。 
4. 对于类型 1 查询`1 X Y`,查询饮料的酒精度数`Y`。 设位置 X 处的旧值为`old`新值是`new`。 应用差异`new - old`到位置 X 的 Fenwick 树，然后将存储的数组值替换为`new`。 

按差值进行更新就足够了，因为包含位置 X 的每个 Fenwick 节点只需要将其存储的总和更改恰好相同的量。 
5. 对于类型 2 查询`2 L R`, 计算

 S=总和(L,R)

 使用芬威克树。 该区间包含RL−L+1小时，因此其安全酒精限量为

 30(R−L+1)。 

打印`YES`如果 S>30(R−L+1)，并且`NO`否则。 
6. 按原始顺序处理所有查询。 更新会更改当前计划，因此以后的每个范围查询都必须使用修改后的 Fenwick 树和数组。 

不变的是，在每次处理操作之后，芬威克树包含每个前缀处当前酒精值的精确总和，并且单独的数组包含每个位置处的当前值。 点更新将两种表示更改相同的量，因此不变量在更新后仍然存在。 由于每个范围总和都是从两个正确的前缀总和中获得的，因此每个 2 类查询都会将准确的当前酒精总量与准确的每小时 30 升限制进行比较。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, delta):
        while i <= self.n:
            self.bit[i] += delta
            i += i & -i

    def prefix_sum(self, i):
        result = 0
        while i > 0:
            result += self.bit[i]
            i -= i & -i
        return result

    def range_sum(self, l, r):
        return self.prefix_sum(r) - self.prefix_sum(l - 1)

def solve():
    n, m, q = map(int, input().split())

    drinks = input().split()

    value = {}
    for _ in range(m):
        name, v = input().split()
        value[name] = int(v)

    arr = [value[name] for name in drinks]

    fw = Fenwick(n)

    for i, v in enumerate(arr, 1):
        fw.add(i, v)

    out = []

    for _ in range(q):
        query = input().split()
        t = int(query[0])

        if t == 1:
            x = int(query[1])
            y = query[2]

            new_value = value[y]
            old_value = arr[x - 1]

            fw.add(x, new_value - old_value)
            arr[x - 1] = new_value

        else:
            l = int(query[1])
            r = int(query[2])

            total = fw.range_sum(l, r)
            limit = 30 * (r - l + 1)

            if total > limit:
                out.append("YES")
            else:
                out.append("NO")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```字典`value`在预期的 O(1) 时间内执行名称到酒精的转换。 在任何动态操作开始之前，初始计划将转换一次。 

这`arr`数组存储每个位置的当前数值。 这是在更新期间需要的，因为 Fenwick 树仅存储聚合和，因此我们需要旧值来计算应传播的差值。 

芬威克树通过添加每个数组值来初始化。 通过上面的简单实现，这需要 O(NlogN)。 O(N) 构造是可能的，但这里没有必要，因为 N≤2⋅10 5。 

对于位置的更新`x`，表达式`new_value - old_value`可以是正数、负数或零。 零差异是无害的，并且正确地使所有相关总和保持不变。 

范围查询使用`prefix_sum(r) - prefix_sum(l - 1)`。 这`l - 1`是什么使得区间两边都包含在内。 由于输入位置的索引为 1，因此 Fenwick 树也特意为索引为 1。 

Python 整数不会溢出，而且最大可能的总数也只有 100⋅200000=20,000,000。 输出累积在一个列表中并写入一次，这避免了过多的调用`print`。 

## 工作示例

 ### 示例 1

 饮料值是`vodka = 30`,`pitu = 35`,`beats = 15`,`whisky = 20`， 和`cuba = 50`。 因此，初始数值数组是`[30, 35, 15, 20, 30, 50]`。 

| 运营| 当前相关数组| 范围总和 | 限制| 输出|
 | --- | --- | --- | --- | --- |
 |`2 3 4`|`[30,35,15,20,30,50]`| 15+20=35 | 30·2=60 | 30·2=60`NO`|
 |`1 3 cuba`|`[30,35,50,20,30,50]`| | | |
 |`2 3 3`|`[30,35,50,20,30,50]`| 50 | 50 30|`YES`|
 |`1 5 cuba`|`[30,35,50,20,50,50]`| | | |
 |`2 1 5`|`[30,35,50,20,50,50]`| 180 | 180 150 | 150`YES`|

 第一个查询是安全的，因为 35 低于 60 升限制。 位置 3 更改后`beats`到`cuba`，其值变为50，使得一小时的查询超出了30升的限制。 第二次更新将第 5 位从 30 更改为 50，将前 5 位提高到 180，超过了 150。 

### 构造示例

 考虑这个小案例：```
4 2 5
a a b a
a 30
b 60
2 1 4
1 2 b
2 1 2
1 4 b
2 3 4
```初始数组是`[30,30,60,30]`。 

| 运营| 运算后的数组 | 范围总和 | 限制| 输出|
 | --- | --- | --- | --- | --- |
 |`2 1 4`|`[30,30,60,30]`| 150 | 150 120 | 120`YES`|
 |`1 2 b`|`[30,60,60,30]`| | | |
 |`2 1 2`|`[30,60,60,30]`| 90 | 90 60|`YES`|
 |`1 4 b`|`[30,60,60,60]`| | | |
 |`2 3 4`|`[30,60,60,60]`| 120 | 120 60|`YES`|

 此跟踪表明更新会立即反映在后续范围总和中。 它还检查最终查询中的包含端点处理，其中位置 3 和 4 都起作用。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((N+M+Q)logN) | O((N+M+Q)logN) | 饮料映射需要 O(M)，Fenwick 初始化需要 O(NlogN)，每次更新或范围查询需要 O(logN)。 |
 | 空间| O(N+M) | 饮料字典使用 O(M)，而当前数组和 Fenwick 树使用 O(N)。 |

 当 N,M,Q≤2⋅10 5 时，该解决方案仅执行几百万次对数 Fenwick 运算，而不是潜在的数百亿次间隔扫描。 内存使用量完全低于 256 MB。 

## 测试用例

 以下测试工具使用相同的`solve()`实现并暂时替换标准输入和输出。 最大大小的情况使用 200000 个位置和 200000 个查询，这足以练习渐近行为，而无需在社论中嵌入巨大的文字字符串。```python
import sys
import io

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, delta):
        while i <= self.n:
            self.bit[i] += delta
            i += i & -i

    def prefix_sum(self, i):
        result = 0
        while i > 0:
            result += self.bit[i]
            i -= i & -i
        return result

    def range_sum(self, l, r):
        return self.prefix_sum(r) - self.prefix_sum(l - 1)

def solve():
    input = sys.stdin.readline

    n, m, q = map(int, input().split())
    drinks = input().split()

    value = {}
    for _ in range(m):
        name, v = input().split()
        value[name] = int(v)

    arr = [value[name] for name in drinks]

    fw = Fenwick(n)
    for i, v in enumerate(arr, 1):
        fw.add(i, v)

    out = []

    for _ in range(q):
        query = input().split()
        if query[0] == "1":
            x = int(query[1])
            y = query[2]

            new_value = value[y]
            old_value = arr[x - 1]

            fw.add(x, new_value - old_value)
            arr[x - 1] = new_value
        else:
            l = int(query[1])
            r = int(query[2])

            total = fw.range_sum(l, r)
            limit = 30 * (r - l + 1)

            out.append("YES" if total > limit else "NO")

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

sample1 = """\
6 6 5
vodka pitu beats whisky vodka cuba
vodka 30
caipirinha 10
pitu 35
beats 15
whisky 20
cuba 50
2 3 4
1 3 cuba
2 3 3
1 5 cuba
2 1 5
"""

assert run(sample1) == "NO\nYES\nYES", "sample 1"

minimum = """\
1 1 2
a
a 30
2 1 1
1 1 a
"""

assert run(minimum) == "NO", "minimum-size equality case"

boundary = """\
2 2 4
a b
a 30
b 31
2 1 2
2 2 2
1 1 b
2 1 1
"""

assert run(boundary) == "YES\nYES\nYES", "inclusive boundaries and update"

all_equal = """\
5 1 4
a a a a a
a 31
2 1 5
1 3 a
2 3 3
2 2 4
"""

assert run(all_equal) == "YES\nYES\nYES", "all-equal values"

n = 200000
q = 200000
max_input = (
    f"{n} 1 {q}\n"
    + " ".join(["a"] * n)
    + "\n"
    + "a 1\n"
    + "\n".join(["2 1 1"] * q)
    + "\n"
)

assert run(max_input) == ("NO\n" * q).rstrip("\n"), "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 |`NO`,`YES`,`YES`| 官方查询及更新顺序|
 |`minimum`|`NO`| N=1 且与安全极限完全相等 |
 |`boundary`|`YES`,`YES`,`YES`| 包含端点、单元素范围和点更新 |
 |`all_equal`|`YES`,`YES`,`YES`| 在不同的间隔长度上重复相同的值和查询 |
 |`max_input`|`NO`重复200000次| 大N和Q，强调对数实现|

 ## 边缘情况

 第一个边缘情况是一小时间隔。 为了```
1 1 1
a
a 31
2 1 1
```Fenwick 树返回 31`[1,1]`。 该算法将极限计算为 30(1−1+1)=30，然后检查 31>30，产生`YES`。 计算使用小时数，而不是直接使用分钟数，因为转换为分钟数已经包含了因子 30。 

等式边界的行为有所不同：```
1 1 1
a
a 30
2 1 1
```范围和是30，极限也是30。严格比较`total > limit`，所以结果是`NO`。 这符合不超过限额的金额是安全的规则。 

更新可以用更大的值替换一个值：```
2 2 1
a a
a 30
b 100
1 1 b
2 1 1
```更新后，`arr[0]`变为 100，芬威克树在位置 1 处收到 100−30=70 的差值。后续查询返回 100，将其与 30 进行比较，并打印`YES`。 旧值永远不会保留在任何 Fenwick 前缀中。 

包容性端点的测试通过```
2 2 1
a b
a 30
b 31
2 1 2
```范围`[1,2]`包含两个值，给出 61。阈值是 30⋅2=60，所以结果是`YES`。 芬威克表达式`prefix(2) - prefix(0)`包括两个位置，这正是查询所需要的。 

最后一个微妙的情况是一个长间隔，其总和恰好是极限。 例如，```
3 1 1
a a a
a 30
2 1 3
```给出总数 90 和极限 30⋅3=90。 算法打印`NO`，确认严格不等式的应用与间隔长度无关。
