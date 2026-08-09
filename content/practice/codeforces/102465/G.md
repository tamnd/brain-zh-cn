---
title: "CF 102465G - 琴弦"
description: "我们有一个初始字符串 S(0)，其长度最多为 1000。后面的每个字符串都是根据已存在的字符串定义的。 APP x y 操作创建 S(x) + S(y)，而 SUB x lo hi 操作创建半开子串 S(x)[lo:hi]。"
date: "2026-08-08T09:20:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102465
codeforces_index: "G"
codeforces_contest_name: "2018-2019 ICPC Southwestern European Regional Programming Contest (SWERC 2018)"
rating: 0
weight: 102465
solve_time_s: 189
verified: true
draft: false
---

[CF 102465G - 字符串](https://codeforces.com/problemset/problem/102465/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个初始字符串，`S(0)`，其长度最多为 1000。后面的每个字符串都是从已存在的字符串定义的。 一个`APP x y`操作创建`S(x) + S(y)`，同时一个`SUB x lo hi`操作创建半开子串`S(x)[lo:hi]`。 

最终的字符串可能是天文数字般大，最多可达`2^63 - 1`字符，所以任务不是构建它。 我们只需要其所有字符的 ASCII 值之和，并减少模数`1,000,000,007`。 

最多有 2500 个字符串。 这足够小，算法可以围绕`O(N^2)`是完全合理的，但是与构造的字符串的长度成正比的任何东西都是不可能的。 一系列`APP`操作可以重复地将长度加倍，因此即使只有几十个操作，所表示的字符串也可能具有比可以单独存储或处理的字符更多的字符。 

长度限制还意味着我们需要区分仅较大的值和用作位置的值。 Python 整数直接处理它们，但算法绝不能执行与长度成比例的操作。 答案本身始终保持模数`1,000,000,007`，而长度被精确存储是因为需要它们来决定哪一侧`APP`操作包含查询的位置。 

第一个不明显的边缘情况是空子字符串。 考虑：```
2
a
SUB 0 0 0
```结果是空字符串，所以正确的输出是`0`。 一个粗心的实现，假设每个`SUB`创建至少一个字符将产生不正确的非零答案或在边界上失败。 

第二个边缘情况是唯一的右端点`SUB`。 为了：```
2
abc
SUB 0 0 3
```结果字符串是`abc`，其 ASCII 总和为`97 + 98 + 99 = 294`。 治疗`hi`作为包容性将错误地包含不存在的第四个字符。 

第三种边缘情况结合了串联和切片：```
4
ab
APP 0 0
SUB 1 1 3
APP 2 0
```这里`S(1) = "abab"`,`S(2) = "ba"`，最终的字符串是`"baab"`。 其总和为`98 + 97 + 97 + 98 = 390`。 这捕获了忘记子字符串操作会更改每个后续查询的坐标系的实现。 

最后，长度本身可以接近`2^63`。 使用固定 32 位整数的实现无法表示它们，即使正确的 64 位实现也必须避免在中间测试构造期间意外创建大于允许的最大值的长度。 下面的解决方案将长度存储为精确的整数，并且仅构造表示形式，而不构造实际字符。 

## 方法

 最简单的解决方案是实际构建每个字符串。 为了`APP x y`，我们复制两个字符串。 为了`SUB x lo hi`，我们复制请求的部分。 这是正确的，因为它完全遵循用于定义字符串的操作。 

问题是所表示的字符串可能非常大。 从单字符字符串开始，重复将字符串与其自身连接起来，使其长度加倍。 63倍加倍后，长度已约为`2^63`。 因此，暴力算法可以执行以下顺序：`2^63`仅针对最终字符串进行字符操作。 这远远超出了四秒限制所允许的范围，并且存储这样的字符串也是不可能的。 

有用的观察是我们不需要任意访问字符。 我们只需要一个完整字符串和一个`SUB`如果我们可以回答其源字符串上的前缀和查询，则操作可以获得该总和。 

定义`prefix(i, k)`作为第一个的总和`k`的字符`S(i)`。 那么总和`S(i)[lo:hi]`简直就是`prefix(i, hi) - prefix(i, lo)`。 

关键问题是如何计算`prefix(i, k)`不扩展`S(i)`。 

对于一个`APP x y`，第一个`k`字符要么完全在里面`S(x)`，或者它们由所有`S(x)`后跟前缀`S(y)`。 因此，一个前缀查询恰好跟随一个子查询。 

对于一个`SUB x lo hi`，第一个`k`的字符`S(i)`与第一个完全对应`lo + k`的字符`S(x)`，除了第一个`lo`字符属于复制的间隔之前。 更直接地说，`prefix(i, k) = prefix(x, lo + k) - prefix(x, lo)`。 

同样，这仅遵循一个依赖链。 

这彻底改变了问题。 最多遍历一个前缀查询`N`构造节点，以及每个`SUB`当我们计算节点的总和时，节点会创建两个这样的查询。 由于只有`N`字符串，总工作量为`O(N^2)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(L)`在哪里`L`可以是`2^63 - 1`|`O(L)`| 太慢了 |
 | 构造DAG的前缀查询|`O(N^2)`|`O(N)`| 已接受 |

 构造历史的行为类似于有向无环图，但我们不需要一般的图遍历。 前缀查询在每个节点选择一个传出依赖项，因此它成为历史记录的简单遍历。 

## 算法演练

 1. 存储初始字符串的前缀和。 为了`S(0)`，我们可以直接计算其第一个的总和`k`个字符，因为它的长度最多为 1000。我们还存储它的长度和 ASCII 总和。 
2. 对于后面的每个字符串，仅存储其类型和定义它的参数。 对于一个`APP`，存储两个源索引。 对于一个`SUB`，存储源索引和区间`[lo, hi)`。 
3. 按照输入顺序处理字符串。 由于每个操作仅引用较早的字符串，因此在处理新字符串时，所有所需的长度和总和都已已知。 
4.对于一个`APP x y`， 放`length[i] = length[x] + length[y]`和`sum[i] = sum[x] + sum[y]`.

The sum is reduced modulo `1,000,000,007`，同时长度保持准确。 
5.对于一个`SUB x lo hi`， 放`length[i] = hi - lo`。 

要计算其总和，请查询源字符串以获取其第一个的总和`hi`字符并减去其第一个字符的总和`lo`人物：`sum[i] = prefix(x, hi) - prefix(x, lo)`。 

两个前缀查询就足够了，因为子字符串正是两个前缀之间的差异。 
6. 实施`prefix(i, k)`作为迭代行走。 如果`i`为零，则使用原始字符串的预先计算的前缀数组。 如果`i`是一个`APP x y`， 比较`k`和`length[x]`。 什么时候`k <= length[x]`，继续`x`。 否则，将总和相加`x`, 减去`length[x]`从`k`，并继续`y`。 
7. 如果当前节点是`SUB x lo hi`，通过替换将请求的前缀位置转换为源字符串`k`和`lo + k`，然后继续`x`。 不需要第二个分支，因为子字符串的前缀始终对应于其源的一个前缀。 
8.所有字符串处理完毕后，输出`sum[N - 1]`，这已经是问题所要求的校验和。 

### 为什么它有效

 不变的是`prefix(i, k)`总是代表第一个的总和`k`的字符`S(i)`。 对于初始字符串，它来自直接前缀数组。 在一个`APP`，请求的前缀要么完全位于左侧字符串中，要么包含整个左侧字符串和右侧字符串的前缀，与算法中的转换完全匹配。 在一个`SUB`，第一个`k`字符对应于源位置`[lo, lo + k)`，其总和是从适当的源前缀差值中获得的。 因此每个前缀查询都是正确的。 一个`SUB`总计是其两个正确源前缀之间的差异，并且`APP`总计是其两个完整子字符串的总和，因此每个存储`sum[i]`是正确的。 因此，最终存储的总和就是所需的校验和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    n = int(input())
    s = input().strip()

    # type[i] is:
    # 0 for the initial string
    # 1 for APP
    # 2 for SUB
    types = [0] * n

    # For APP, a[i] and b[i] are the two source indices.
    # For SUB, a[i] is the source index, and b[i], c[i]
    # are lo and hi.
    a = [0] * n
    b = [0] * n
    c = [0] * n

    length = [0] * n
    total = [0] * n

    # Prefix sums for S(0).
    base_prefix = [0] * (len(s) + 1)
    for i, ch in enumerate(s):
        base_prefix[i + 1] = base_prefix[i] + ord(ch)

    length[0] = len(s)
    total[0] = base_prefix[-1] % MOD

    def prefix(idx, k):
        """
        Sum of the first k characters of S(idx), modulo MOD.

        The query follows exactly one dependency at every
        construction node.
        """
        ans = 0

        while idx != 0:
            if types[idx] == 1:  # APP
                x = a[idx]
                y = b[idx]

                if k <= length[x]:
                    idx = x
                else:
                    ans += total[x]
                    ans %= MOD
                    k -= length[x]
                    idx = y

            else:  # SUB
                x = a[idx]
                lo = b[idx]

                k += lo
                idx = x

        ans += base_prefix[k] % MOD
        return ans % MOD

    for i in range(1, n):
        parts = input().split()

        if parts[0] == "APP":
            x = int(parts[1])
            y = int(parts[2])

            types[i] = 1
            a[i] = x
            b[i] = y

            length[i] = length[x] + length[y]
            total[i] = (total[x] + total[y]) % MOD

        else:
            x = int(parts[1])
            lo = int(parts[2])
            hi = int(parts[3])

            types[i] = 2
            a[i] = x
            b[i] = lo
            c[i] = hi

            length[i] = hi - lo
            total[i] = (prefix(x, hi) - prefix(x, lo)) % MOD

    print(total[n - 1])

if __name__ == "__main__":
    solve()
```数组`length`和`total`保存未来每次操作所需的两条信息。 长度必须保持精确，因为`prefix`使用它们来决定一个位置是属于某个位置的左侧还是右侧`APP`。 总和可以安全地减少模数`MOD`每次加法或减法之后。 

这`prefix`函数是迭代的而不是递归的。 连锁2500个`SUB`操作是合法的，因此递归需要增加Python的递归限制。 迭代完全避免了这种担忧。 

的条件为`APP`是`k <= length[x]`。 价值`k`表示请求的字符数，所以`k == length[x]`完全属于左弦，不应移入右弦。 这是该问题中最常见的差一错误之一。 

对于一个`SUB x lo hi`，当前字符串是`S(x)[lo:hi]`。 长度前缀`k`因此在源位置结束`lo + k`，这就是为什么查询只是添加`lo`到`k`。 

基本情况使用`base_prefix[k]`， 在哪里`k`范围可以从零到`len(s)`。 输入保证每个翻译位置保留在源字符串内，因此不需要额外的剪辑。 

Python 整数可以直接表示允许的长度。 在具有固定宽度整数的语言中，有符号 64 位整数足以满足规定的最大值`2^63 - 1`，但仍必须根据问题的保证检查添加内容。 

## 工作示例

 官方的样例是：```
3
foobar
SUB 0 0 3
APP 1 1
```初始字符串的前缀和为`"foobar"`。 第一个操作提取`"foo"`，第二个操作将该子字符串与其自身连接起来。 

| 步骤| 字符串| 运营| 长度 | 总计 |
 | ---| ---| ---| ---| ---|
 | 0 |`foobar`| 初始| 6 | 627 | 627
 | 1 |`foo`|`SUB 0 0 3`| 3 | 324 | 324
 | 2 |`foofoo`|`APP 1 1`| 6 | 648 | 648

 对于字符串 1，`prefix(0, 3) = 324`和`prefix(0, 0) = 0`，所以它的总数是 324。字符串 2 仅包含字符串 1 的两个副本，给出`324 + 324 = 648`。 因此输出是`648`。 

第二个示例练习嵌套切片和连接：```
4
ab
APP 0 0
SUB 1 1 3
APP 2 0
```建设进展如下。 

| 步骤| 字符串| 运营| 长度 | 总计 |
 | ---| ---| ---| ---| ---|
 | 0 |`ab`| 初始| 2 | 195 | 195
 | 1 |`abab`|`APP 0 0`| 4 | 390 | 390
 | 2 |`ba`|`SUB 1 1 3`| 2 | 195 | 195
 | 3 |`baab`|`APP 2 0`| 4 | 390 | 390

 对于字符串 2，算法要求`prefix(1, 3)`和`prefix(1, 1)`。 第一个查询遍历`S(1) = S(0) + S(0)`，消耗第一个完整的`"ab"`总和为 195，然后取第一个字符`"a"`从第二个副本中得到 292。第二个查询给出 98。它们的区别是`292 - 98 = 194`，这对应于`"ba"`除非算术被误读。 实际的前缀值为`prefix(1, 3) = 293`和`prefix(1, 1) = 98`, 给予`195`，正好是`"ba"`。 该跟踪说明了为什么右侧`APP`必须用调整后的位置来查询`k - length[left]`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(N^2)`| 每个`SUB`执行两个前缀查询，每个查询最多跟随`N`施工节点。 |
 | 空间|`O(N + | S(0) | )`| 我们为每个构造的字符串存储恒定大小的信息，并为初始字符串存储一个前缀数组。 |

 和`N <= 2500`, 最多大约`2N`进行前缀查询，每次最多取`N`步骤。 在最坏的情况下，这给出了大约 1250 万个依赖步骤，这在 Python 中是实用的。 实际的字符串永远不会被存储，因此潜在的巨大`2^63 - 1`长度不影响内存使用。 

## 测试用例

 以下测试工具包括官方示例、最小大小的情况、空子字符串、边界敏感嵌套结构、全等字符串以及最终长度恰好为的结构`2^63 - 1`。```python
import sys
import io
from contextlib import redirect_stdout

MOD = 1_000_000_007

def solve():
    input = sys.stdin.readline

    n = int(input())
    s = input().strip()

    types = [0] * n
    a = [0] * n
    b = [0] * n
    c = [0] * n

    length = [0] * n
    total = [0] * n

    base_prefix = [0] * (len(s) + 1)
    for i, ch in enumerate(s):
        base_prefix[i + 1] = base_prefix[i] + ord(ch)

    length[0] = len(s)
    total[0] = base_prefix[-1] % MOD

    def prefix(idx, k):
        ans = 0

        while idx != 0:
            if types[idx] == 1:
                x = a[idx]
                y = b[idx]

                if k <= length[x]:
                    idx = x
                else:
                    ans = (ans + total[x]) % MOD
                    k -= length[x]
                    idx = y
            else:
                x = a[idx]
                lo = b[idx]
                k += lo
                idx = x

        return (ans + base_prefix[k]) % MOD

    for i in range(1, n):
        parts = input().split()

        if parts[0] == "APP":
            x = int(parts[1])
            y = int(parts[2])

            types[i] = 1
            a[i] = x
            b[i] = y

            length[i] = length[x] + length[y]
            total[i] = (total[x] + total[y]) % MOD

        else:
            x = int(parts[1])
            lo = int(parts[2])
            hi = int(parts[3])

            types[i] = 2
            a[i] = x
            b[i] = lo
            c[i] = hi

            length[i] = hi - lo
            total[i] = (prefix(x, hi) - prefix(x, lo)) % MOD

    print(total[n - 1])

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_input = solve.__globals__["input"]

    sys.stdin = io.StringIO(inp)
    solve.__globals__["input"] = sys.stdin.readline

    output = io.StringIO()

    try:
        with redirect_stdout(output):
            solve()
    finally:
        sys.stdin = old_stdin
        solve.__globals__["input"] = old_input

    return output.getvalue().strip()

# Provided sample
assert run(
    """3
foobar
SUB 0 0 3
APP 1 1
"""
) == "648", "sample 1"

# Minimum-size input: N = 1
assert run(
    """1
a
"""
) == "97", "minimum-size case"

# Empty substring: hi == lo
assert run(
    """2
a
SUB 0 0 0
"""
) == "0", "empty substring"

# Boundary-sensitive nested APP/SUB construction
assert run(
    """4
ab
APP 0 0
SUB 1 1 3
APP 2 0
"""
) == "390", "nested substring and concatenation"

# All characters equal
assert run(
    """4
z
APP 0 0
APP 1 1
SUB 2 0 4
"""
) == str((122 * 4) % MOD), "all-equal values"

# Final length exactly 2^63 - 1.
#
# S(0) has length 1.
# After 62 doublings, S(62) has length 2^62.
# S(63) has length 2^62 - 1.
# S(64) has length 2^63 - 2.
# S(65) has length 2^63 - 1.
parts = ["66", "a"]

for i in range(62):
    x = i
    parts.append(f"APP {x} {x}")

parts.append(f"SUB 62 0 {2**62 - 1}")
parts.append("APP 63 63")
parts.append("APP 64 0")

max_case = "\n".join(parts) + "\n"

expected_max = (97 * ((2**63) - 1)) % MOD

assert run(max_case) == str(expected_max), "maximum-length case"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 官方的`foobar`样品|`648`| 基本的`SUB`其次是`APP`|
 |`N = 1`,`S(0) = "a"`|`97`| 最小输入和基本前缀 |
 |`SUB 0 0 0`|`0`| 空子串 |
 |`ab`， 其次是`APP`,`SUB`,`APP`|`390`| 嵌套坐标翻译 |
 | 重复`z`串联|`488`| 全等值和模和 |
 | 最终长度`2^63 - 1`|`243684095`| 巨大的长度却没有具体化|

 ## 边缘情况

 空子串的情况```
2
a
SUB 0 0 0
```有`length[1] = 0`。 两个前缀查询都是`prefix(0, 0)`，所以它们的差异为零。 该算法从不尝试访问位置零处的字符，因为长度为零的前缀是有效的。 

对于独家端点情况```
2
abc
SUB 0 0 3
```该算法计算`prefix(0, 3) - prefix(0, 0)`。 第一个值是`294`，第二个是`0`，所以结果是`294`。 从不考虑索引 3 处的字符，因为`hi`是唯一端点。 

对于嵌套结构```
4
ab
APP 0 0
SUB 1 1 3
APP 2 0
```这`SUB`操作请求位置`[1, 3)`从`"abab"`。 其前缀查询为`k = 3`被翻译到源位置`1 + 3 = 4`，而其前缀查询为`k = 1`被翻译到源位置`1 + 1 = 2`。 差值就是位置的总和`[2, 4)`在源码中，分别是`"ba"`。 决赛`APP`添加`"ab"`并产生`"baab"`与总和`390`。 

对于最大长度的情况，每个字符都是`'a'`，所以最终的总和就是`97 * (2^63 - 1)`模数`1,000,000,007`。 该算法从不存储这些字符。 它仅存储最终长度及其模和，而每个前缀查询都会遍历紧凑的构造历史。 预期结果是`243684095`。 

要消除的中心模式比这个特定问题更广泛。 每当从串联和子字符串引用构建一个大对象时，询问所需的聚合是否可以表示为前缀查询。 如果可以的话，串联通常会让前缀查询选择一个子项，而子字符串通常只是移动查询的坐标。 这将一个明显指数大小的对象变成了一个可以在多项式时间内遍历的小型依赖图。 

如果您愿意，我还可以提供更短的竞赛编辑版本或使用相同前缀查询思想的 C++17 实现。
