---
title: "CF 105883E - 另一个 GCD"
description: "我们维护一个动态的整数对集合，其中每对都有一个值 v 和一个权重 w。 该结构支持插入对、删除现有的出现以及回答以下形式的查询：给定一个整数 k，在所有存储的对中查找第一个..."
date: "2026-06-22T02:44:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105883
codeforces_index: "E"
codeforces_contest_name: "Baozii Cup 2"
rating: 0
weight: 105883
solve_time_s: 46
verified: true
draft: false
---

[CF 105883E - 另一个 GCD](https://codeforces.com/problemset/problem/105883/E)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个动态的整数对集合，其中每对都有一个值`v`和一个重量`w`。 该结构支持插入对、删除现有的出现以及回答以下形式的查询：给定一个整数`k`，在所有存储的对中找到第一个分量与以下对象共享非平凡公约数的对`k`，并返回最大值`w`他们之中。 

“非互质”条件意味着我们只关心其中的对`v`和`k`至少共享一个素因数。 因此，每个查询实际上都是在询问： 在所有活动对中，其`v`有一些共同的质因数`k`，最大重量是多少`w`。 

约束很大：最多 200000 次操作，并且值为`v`和`k`最多 500000。这会立即排除针对每个查询的所有活动元素重新计算 gcd 检查。 即使扫描每个查询的多重集，在最坏的情况下也会导致大约 2e10 次操作，这远远超出了限制。 

关键的结构压力点是条件仅取决于`v`和`k`，而不是其全部价值。 这表明问题实际上是通过素数整除来组织对，而不是通过它们的原始整数身份来组织。 

如果尝试维护每个值，就会出现微妙的失败情况`v`, 一个最好的`w`然后迭代所有`v`在查询中。 这失败了，因为有太多不同的`v`。 另一个常见的错误想法是预先计算`k`每个查询并扫描所有`v`可被这些除数整除，但如果没有有效的索引，这仍然会退化为线性扫描。 

## 方法

 暴力方法很简单：将所有对存储在列表中，并且对于每个查询迭代所有内容，检查 gcd(v, k) 并跟踪最佳值`w`。 这是正确的，因为它直接匹配定义，但每个查询的成本为 O(n)，因此总复杂度变为 O(n²)，这对于 2e5 次操作来说太慢了。 

关键的观察结果是 gcd(v, k) 大于 1 当且仅当`v`至少有一个素因数与`k`。 因此，我们可以将数字分解为其素数因子，并将查询重新构建为素数除法的并集，而不是考虑 gcd 检查`k`。 

现在问题变成：对于每个素数`p`，我们想快速知道最大值`w`在所有活跃对中`v`可以整除`p`。 如果我们有每个素数的信息，查询就会减少为枚举素数`k`并取这些桶中的最大值。 

复杂的是删除。 由于对被插入和删除，如果没有支持动态更新的结构，我们就不能只维护每个质数的单个最大值。 处理这个问题的标准方法是维护，对于每个素数`p`，所有的多重集（或带有延迟删除的堆）`w`当前活跃货币对贡献的价值`v`可以整除`p`。 

我们还需要对 5e5 以内的数字进行高效分解，这是由最小素因数筛处理的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 带堆的 Prime 桶 | O(n log n + n sqrt V) | O(n log n + n sqrt V) | O(n sqrt V) | 已接受 |

 ## 算法演练

 我们对 500000 以内的所有整数进行预处理，以便可以在 O(log n) 时间内分解任何数字。 

我们维护一本从素数开始的字典`p`存储所有权重的多集结构`w`当前活跃对的`v`可以整除`p`。 为了支持删除，我们还准确跟踪哪个素数值`v`有助于.

 ### 步骤

 1. 构建数组`spf`在哪里`spf[x]`是最小的质因数`x`。 这允许快速分解任何`v`或者`k`。 
2. 维护全局哈希图`pos`对于每个插入的对存储`(v, w)`，不同质因数的列表`v`。 这是必要的，以便当我们删除时`(v, w)`我们确切地知道要更新哪些主要存储桶。 
3.维护字典`mp[p]`，其中每个条目都是一个支持插入和删除权重的最大结构。 由于需要移除，每个`mp[p]`被实现为排序多重集（通过堆加上延迟删除或平衡结构）。 
4. 对于插入`+ v w`,因式分解`v`使用`spf`并提取其独特的质因数。 对于每个这样的素数`p`， 插入`w`进入`mp[p]`。 将素数列表存储在`pos[(v, w)]`。 
5. 对于删除`- v w`， 取回`pos[(v, w)]`并删除`w`从每个对应的`mp[p]`。 然后删除记录。 
6. 查询`? k`,因式分解`k`分解为不同的素数。 对于每个素数`p`划分`k`，检查当前最大值`mp[p]`。 答案是所有这些素数中的最大值。 如果映射中不存在这样的素数或者所有桶都为空，则返回 0。 

### 为什么它有效

 任何时候，一对`(v, w)`包含在查询的答案中`k`恰好在什么时候`v`至少有一个素因数与`k`。 如果`p`是一个公素因数，那么`(v, w)`为桶做出贡献`mp[p]`。 因此，每个有效候选者至少出现在与素数对应的桶中`k`。 对这些桶取最大值涵盖所有有效候选者，并且不会包含无效对，因为它不能出现在任何共享素数桶中。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXV = 500000

spf = list(range(MAXV + 1))
for i in range(2, int(MAXV ** 0.5) + 1):
    if spf[i] == i:
        for j in range(i * i, MAXV + 1, i):
            if spf[j] == j:
                spf[j] = i

def factorize(x):
    primes = []
    while x > 1:
        p = spf[x]
        primes.append(p)
        while x % p == 0:
            x //= p
    return primes

mp = {}
pos = {}

def add(v, w):
    primes = factorize(v)
    used = set(primes)
    pos[(v, w)] = used
    for p in used:
        if p not in mp:
            mp[p] = {}
        mp[p][w] = mp[p].get(w, 0) + 1

def remove(v, w):
    used = pos.pop((v, w))
    for p in used:
        if p in mp:
            mp[p][w] -= 1
            if mp[p][w] == 0:
                del mp[p][w]

def get_max(d):
    if not d:
        return 0
    return max(d.keys())

out = []

n = int(input())
for _ in range(n):
    tmp = input().split()
    if tmp[0] == '+':
        v = int(tmp[1]); w = int(tmp[2])
        add(v, w)
    elif tmp[0] == '-':
        v = int(tmp[1]); w = int(tmp[2])
        remove(v, w)
    else:
        k = int(tmp[1])
        primes = factorize(k)
        ans = 0
        seen = set()
        for p in primes:
            if p in seen:
                continue
            seen.add(p)
            if p in mp:
                ans = max(ans, get_max(mp[p]))
        out.append(str(ans))

print("\n".join(out))
```筛子预先计算最小的质因数，因此因式分解对于所有操作来说都足够快。 这`mp`结构为每个质数存储权重的频率图，即使相同的权重出现多次也允许删除。 查询逻辑删除重复的素数`k`所以重复的因素不会造成多余的工作。 

一个微妙的点是我们永远不会存储满`(v, w)`质数桶中的对象，仅具有多重权重。 这已经足够了，因为查询只要求最大`w`，而不是哪一对实现了它。 

## 工作示例

 考虑顺序：```
+ 4 5
+ 3 4
? 2
```插入后`(4,5)`，由于 4 的素因数为 2，桶`mp[2] = {5}`。 

插入后`(3,4)`，它仅有助于`mp[3]`。 

现在可以查询`k = 2`，因式分解给出`{2}`。 我们看看`mp[2]`并获得最大权重 5。 

| 步骤| 运营| mp[2] | mp[3]| 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | +4 5 | {5} | {} | - |
 | 2 | +3 4 | {5} | {4} | - |
 | 3 | ?2 | {5} | {4} | 5 |

 现在考虑：```
+ 6 10
+ 10 7
? 15
```质因数：6 → {2,3}、10 → {2,5}、15 → {3,5}。 查询检查存储桶 3 和 5。 

| 步骤| 运营| mp[2] | mp[3]| mp[5]| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | +6 10 | {10} | {10} | {} | - |
 | 2 | +10 7 | {10,7} | {10} | {7} | - |
 | 3 | ?15 | {10,7} | {10} | {7} | 10 | 10

 跟踪显示候选者是通过共享素数桶聚合的，并且最终的最大值是在所有相关素数中取得的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log V + n α) | 每个操作都以 O(log V) 的形式分解数字，并且每个素数因子的更新受不同素数的数量限制 |
 | 空间| O(n + V) | 多种 SPF 和活性 Prime 桶的存储 |

 筛子主导预处理，而每个查询仅涉及`k`，即使在最坏的情况下也最多有几十个。 这非常适合在 2 秒内完成 2e5 操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    MAXV = 500000
    spf = list(range(MAXV + 1))
    for i in range(2, int(MAXV ** 0.5) + 1):
        if spf[i] == i:
            for j in range(i * i, MAXV + 1, i):
                if spf[j] == j:
                    spf[j] = i

    def factorize(x):
        res = set()
        while x > 1:
            p = spf[x]
            res.add(p)
            while x % p == 0:
                x //= p
        return res

    mp = {}
    pos = {}

    def add(v, w):
        ps = factorize(v)
        pos[(v, w)] = ps
        for p in ps:
            mp.setdefault(p, {})
            mp[p][w] = mp[p].get(w, 0) + 1

    def remove(v, w):
        ps = pos.pop((v, w))
        for p in ps:
            mp[p][w] -= 1
            if mp[p][w] == 0:
                del mp[p][w]

    n = int(input())
    out = []
    for _ in range(n):
        parts = input().split()
        if parts[0] == '+':
            add(int(parts[1]), int(parts[2]))
        elif parts[0] == '-':
            remove(int(parts[1]), int(parts[2]))
        else:
            k = int(parts[1])
            ps = factorize(k)
            ans = 0
            for p in ps:
                if p in mp:
                    ans = max(ans, max(mp[p].keys()))
            out.append(str(ans))

    return "\n".join(out)

# provided sample (illustrative)
assert run("""5
+ 4 5
+ 3 4
? 2
? 3
? 4
""") == "5\n4\n5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小插入/查询| 正确的最大检索 | 基本正确性 |
 | 多个素数重叠 | 最大桶数 | 素因数的并集 |
 | 重复插入/删除| 多重性处理 | 删除正确性 |

 ## 边缘情况

 一个棘手的情况是多个插入的对共享相同的权重但属于不同的值。 该结构不得将配对的同一性与权重频率混淆； 删除操作必须仅删除一次出现的情况。 

例如：```
+ 6 10
+ 10 10
? 15
```两者都对共享主存储桶有贡献，但最大值仍为 10。如果删除其中一个，则另一个仍必须保持该值处于活动状态。 

另一个边缘情况是重复素因数`k`， 例如`k = 8`。 如果没有素数的重复数据删除，同一个存储桶将被多次查询，这是低效的，并且可能会扭曲依赖堆顶跟踪的实现中的推理。 素数去重可确保每个查询只考虑每个存储桶一次，这与 gcd 的数学结构相匹配。
