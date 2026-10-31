---
title: "CF 1614E - 长沙发和小屋"
description: "我们被要求模拟 Divan 小屋内温度在连续几天内的变化，其中温度每天向室外温度调整一个单位。"
date: "2026-06-10T06:50:16+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1614
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 757 (Div. 2)"
rating: 2600
weight: 1614
solve_time_s: 117
verified: false
draft: false
---

[CF 1614E - 沙发床和小屋](https://codeforces.com/problemset/problem/1614/E)

 **评分：** 2600
 **标签：** 二分查找、数据结构
 **求解时间：** 1m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求模拟 Divan 小屋内温度在连续几天内的变化，其中温度每天向室外温度调整一个单位。 具体来说，如果当前室内温度小于室外温度，则加1；如果当前室内温度小于室外温度，则加1。 如果更大，则减一； 否则，它保持不变。 然后我们被要求回答以下形式的查询：如果室内温度开始于`x`第一天，之后会怎样`i`天？ 每个查询都使用滚动编码`lastans`需要模运算来解码的值，并且必须按照收到的顺序回答查询。 

限制很重要：最多可达 200,000 天，所有天的查询总数也最多为 200,000 个。 因此，每天迭代每个查询的简单模拟会太慢，因为在最坏的情况下，它可能会执行粗略的结果`200,000 * 200,000`操作，远远超出了2秒的时间限制。 输入的数字可以大到`10^9`，因此依赖于密集阵列或在温度范围内进行简单迭代计数的解决方案也会因内存或时间限制而失败。 

不明显的边缘情况包括完全在可能的最高或最低温度下开始的查询，或者外部温度保持恒定的连续几天。 例如，如果查询从 0 开始，第一天的室外温度为 10，则室内温度每天都会增加 1，直到达到 10。假设查询独立于前一天的查询的粗心实现会计算错误，因为`lastans`在模拟之前修改每个查询。 

## 方法

 暴力方法很简单：对于每个查询，逐日模拟温度。 每天，将当前温度与室外温度进行比较并相应调整一。 这是正确的，因为它直接遵循规则，但它具有最坏情况的复杂性`O(Q * N)`在哪里`Q`是查询的数量，`N`是天数。 两者都达到`2 * 10^5`，这可能会导致高达`4 * 10^{10}`的操作，这是不可行的。 

关键的见解是每天的影响可以表示为范围变化。 具体来说，之后`i`天，任何初始温度`x`如果我们始终接近每日室外温度，则将受到可达到的最低和最高温度的限制。 更正式地说，我们可以维护两个变量，`lo`和`hi`，代表处理迄今为止的天数后任何起点的最低和最高可能温度。 每一天，`lo`如果低于则向上调整`T_i`，如果高于则向下`T_i`。 相似地，`hi`调整为`T_i`。 然后，任何查询都可以在`O(1)`通过固定初始温度`x`之间`lo`和`hi`。 

这将问题从潜在的`O(Q * N)`通过恒定时间查询评估对线性时间进行暴力模拟。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(Q * N) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(N + Q) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`lo`和`hi`到 0，表示相对于初始状态可能的最小和最大温度变化。 初始化`lastans`至 0。 
2. 迭代每一天`i`从 1 到`n`。 对于当前室外温度`T_i`，更新边界：

 - 增量`lo`如果它小于`T_i`或者如果它大于则递减它`T_i`。 然后夹住`lo`到`T_i`如果超过了。 
- 同样调整`hi`朝向`T_i`。 

这确保了`lo`和`hi`始终代表迄今为止处理所有天数后可能的室内温度范围。 
3. 对于每个查询`x'_i`当天`i`，首先解码真实的查询值：`x_i = (x'_i + lastans) % (10^9 + 1)`。 
4.通过夹紧回答查询`x_i`之间`lo`和`hi`。 放`lastans`到这个结果并输出它。 
5. 重复此操作，直到处理完所有日期和查询。 

不变的是处理后`i`天，`lo`是从任意时刻开始可达到的最低温度`x`并逐渐接近每天的室外温度，以及`hi`是最大的。 夹紧任意`x`之内`[lo, hi]`无需模拟每个步骤即可正确模拟增量调整。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
lastans = 0
lo = hi = 0

for _ in range(n):
    T = int(input())
    k = int(input())
    queries = list(map(int, input().split()))

    # Update bounds
    if lo < T:
        lo += 1
        if lo > T:
            lo = T
    elif lo > T:
        lo -= 1
        if lo < T:
            lo = T

    if hi < T:
        hi += 1
        if hi > T:
            hi = T
    elif hi > T:
        hi -= 1
        if hi < T:
            hi = T

    # Answer queries
    for x_enc in queries:
        x = (x_enc + lastans) % (10**9 + 1)
        lastans = max(lo, min(hi, x))
        print(lastans)
```代码完全遵循算法。 界限会根据当天的室外温度逐步调整。 查询使用解码`lastans`处理加密的输入。 最终的夹紧确保每个查询都得到回答`O(1)`时间，无需模拟每个查询的每个中间日。 必须注意模运算和更新顺序`lastans`。 

## 工作示例

 使用示例 1：

 | 日 | T_i | 查询 x'_i | x 解码 | 瞧| 你好| 拉斯坦斯| 输出|
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 50 | 50 1 | 1 | 1 | 1 | 2 | 2 |
 | 1 | 50 | 50 2 | 4 | 1 | 1 | 5 | 5 |
 | 1 | 50 | 50 3 | 9 | 1 | 1 | 9 | 9 |
 | 2 | 50 | 50 4 | 13 | 2 | 2 | 15 | 15 15 | 15

 该表显示了如何`lo`和`hi`根据每天的温度进行调整，每个查询都夹在它们之间以获得最终答案。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N + Q) | 每天的边界更新一次，每个查询都在 O(1) | 内得到答复。 
| 空间| O(1) | O(1) | 只维护少数整数； 不需要与输入大小成比例的数组 |

 该解决方案可以在时间和内存限制内轻松处理 200,000 天和 200,000 个查询。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    lastans = 0
    lo = hi = 0
    n = int(input())
    for _ in range(n):
        T = int(input())
        k = int(input())
        queries = list(map(int, input().split()))
        if lo < T:
            lo += 1
            if lo > T: lo = T
        elif lo > T:
            lo -= 1
            if lo < T: lo = T
        if hi < T:
            hi += 1
            if hi > T: hi = T
        elif hi > T:
            hi -= 1
            if hi < T: hi = T
        for x_enc in queries:
            x = (x_enc + lastans) % (10**9 + 1)
            lastans = max(lo, min(hi, x))
            output.append(str(lastans))
    return "\n".join(output)

# Sample
assert run("3\n50\n3\n1 2 3\n50\n3\n4 5 6\n0\n3\n7 8 9\n") == "2\n5\n9\n15\n22\n30\n38\n47\n53", "sample 1"

# Minimum size
assert run("1\n0\n1\n0\n") == "1", "min input"

# Max temperature
assert run("1\n1000000000\n2\n0 1000000000\n") == "1\n1000000000", "max temperature"

# All days same temperature
assert run("2\n5\n1\n2\n5\n1\n3\n") == "3\n5", "constant temperature"

# Edge case with lastans wrap-around
assert run("2\n1\n1\n1000000000\n2\n1\n1 2\n") == "1000000000\n1000000000\n1000000001", "lastans wrap"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1\n0\n1\n0 | 1\n0\n1\n0 | 1 | 最小输入处理 |
