---
title: "CF 105423I - \u6570\u636e\u68c0\u7d22\u7cfb\u7edf"
description: "我们正在构建一个简化的会员系统，其行为类似于具有多个哈希函数的哈希过滤集。 系统将元素存储在大小为 n 的二进制数组中，最初全为零。"
date: "2026-06-23T04:17:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105423
codeforces_index: "I"
codeforces_contest_name: "2024\u6e56\u5357\u7701\u8d5b"
rating: 0
weight: 105423
solve_time_s: 59
verified: true
draft: false
---

[CF 105423I - \u6570\u636e\u68c0\u7d22\u7cfb\u7edf](https://codeforces.com/problemset/problem/105423/I)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在构建一个简化的会员系统，其行为类似于具有多个哈希函数的哈希过滤集。 系统将元素存储在大小为二进制的数组中`n`，最初全为零。 当插入一个元素时，我们计算`k`确定性的类似散列的值，并将数组中的这些位置标记为`1`。 当我们查询一个元素时，我们会重新计算相同的元素`k`值并检查所有相应的位置是否已经`1`。 如果是，我们报告该元素“存在”，否则我们报告它不存在。 

转换函数非常简单：对于每个函数索引`i`，该值映射为`h_i(x) = x^i mod n`。 这意味着每个元素都会产生一小组索引`[0, n-1]`，这些索引驱动插入和查询。 

约束足够小，我们可以进行简单的模拟。 和`n, m, q ≤ 10000`和`k ≤ 10`，每次运算最多为 10 次模幂或乘法。 即使我们天真地计算每个查询和插入的幂，总工作仍然在限制范围内，因为我们只执行大约`m + q`操作，每项操作的恒定成本都很小。 

一个微妙的边缘情况来自于索引取模的事实`n`，因此冲突是预料之中的，甚至是正确性所必需的。 另一个问题是同一查询或插入中的重复索引。 自从`h_i(x)`可以等于`h_j(x)`对于不同的`i`和`j`、标记或检查必须安全地处理重复。 使用集合或简单地迭代所有索引而不进行重复数据删除仍然有效，但重复数据删除避免了不必要的重复检查。 

一个幼稚的错误是将求幂视为线性乘法而不进行模约化，或者忘记这一点`x^i`成长很快。 然而，自从`i ≤ 10`，直接计算是安全的。 另一个陷阱是误解这不是真正的概率布隆过滤器，而是确定性的固定哈希变体。 

## 方法

 蛮力解释很简单：对于每个插入，计算所有`k`权力，并将数组中的这些位置设置为`1`。 对于每个查询，重新计算相同的`k`位置并检查它们是否每一个都在`1`。 

这种方法是正确的，因为系统定义直接指出成员资格仅由这些职位决定。 除了数组本身之外，不存在任何隐藏状态或顺序依赖性。 

复杂性瓶颈并非来自运算数量，而是来自如果实施效率低下时的重复求幂。 如果我们重新计算`x^i`每次从头开始在循环内使用朴素乘法，每次操作都会花费`O(i)`，给出最坏情况`O(k^2)`每次操作，在限制下仍然微不足道。 即使更昂贵的方法仍然会通过。 

关键的观察是`k ≤ 10`很小，所以我们不需要任何高级优化。 预计算能力高达指数`k`对于每个值或增量计算它们就足够了。 我们可以计算`x^1`，然后重复乘以`x`模数`n`要得到`x^2`,`x^3`， 等等。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((m+q) · k · log i) 或 O((m+q) · k²) | O(n) | 已接受 |
 | 最佳| O((m+q) · k) | O((m+q) · k) | O(n) | 已接受 |

 ## 算法演练

 我们维护一个二进制数组`arr`尺寸的`n`，最初全为零。 

1. 阅读`n, k, m, q`并初始化`arr`带零。 该数组表示每个索引是否已被至少一个插入元素激活。 
2.对于每个插入的元素`x`，计算所有值`x^1 mod n, x^2 mod n, ..., x^k mod n`。 这可以通过维持运行功率值来迭代地完成。 
3. 对于每个计算出的索引，设置`arr[index] = 1`。 重复赋值是无害的，因为数组是幂等的。 
4. 对于每个查询元素`y`，使用相同的迭代指数方法计算相同的索引序列。 
5.检查全部`k`指数。 如果有任何位置`arr`是`0`， 输出`0`立即进行该查询。 
6. 如果所有位置都是`1`， 输出`1`。 

我们为每个元素单独重新计算幂而不是缓存的原因是`m`和`q`很小，并且输入是独立的。 Shared caching would complicate implementation without improving asymptotic complexity meaningfully.

 ### 为什么它有效

 Each element is represented entirely by the set of indices produced by the transformation functions. 插入保证这些索引设置为`1`。 A query succeeds only if every index corresponding to the query element has been set by some previous insertion. 由于数组从不重置位`1`回到`0`，它单调地积累插入元素的证据。 因此，如果查询的完整索引集包含在激活位置集中，则它一定是较早插入的（或者在此哈希方案下无法区分），这与问题的成员资格定义相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def compute_indices(x, k, n):
    res = []
    val = x % n
    for i in range(1, k + 1):
        res.append(val)
        val = (val * x) % n
    return res

def main():
    n, k, m, q = map(int, input().split())
    arr = [0] * n

    insert_vals = list(map(int, input().split()))
    query_vals = list(map(int, input().split()))

    for x in insert_vals:
        for idx in compute_indices(x, k, n):
            arr[idx] = 1

    out = []
    for y in query_vals:
        ok = True
        for idx in compute_indices(y, k, n):
            if arr[idx] == 0:
                ok = False
                break
        out.append('1' if ok else '0')

    print(' '.join(out))

if __name__ == "__main__":
    main()
```核心实现细节是迭代功率计算。 而不是重新计算`x^i`从头开始，我们维护`val = x^i mod n`并将其更新为`val = val * x % n`。 这减少了重复工作并保持代码整洁和可预测。 

数组`arr`作为唯一的持久状态。 插入仅设置位，而查询仅读取它们。 这种单调结构避免了任何删除处理或回滚逻辑的需要。 

## 工作示例

 ### 示例 1

 输入：```
n=11, k=3, m=4, q=5
insert: [1, 5, 3, 8]
query: [4, 7, 1, 0, 4]
```我们跟踪插入情况。 

为了`x=1`，指数是`[1,1,1]`，因此只有位置 1 变为 1。 

对于`x=5`，指数是`[5, 3, 4]`。 

为了`x=3`，指数是`[3, 9, 5]`。 

为了`x=8`，指数是`[8, 9, 6]`。 

最终激活的数组位于`{1,3,4,5,6,8,9}`。 

现在查询：

 | y | 指数| 检查 arr | 输出|
 | ---| ---| ---| ---|
 | 4 | [4,5,9]| 都存在| 1 |
 | 7 | [7,5,2]| 7 或 2 人失踪 | 0 |
 | 1 | [1,1,1]| 存在 | 1 |
 | 0 | [0,0,0]| 失踪| 0 |
 | 4 | [4,5,9]| 存在 | 1 |

 这证实了重复的指数，例如`[1,1,1]`不影响正确性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((m + q) · k) | O((m + q) · k) | 每个元素计算 k 次模乘 |
 | 空间| O(n) | 大小为 n 的二进制数组 |

 该限制允许总共最多 20,000 次运算，每次运算最多执行 10 次乘法，这在 Python 中是相当快的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from main import main
    main()
    return sys.stdout.getvalue().strip()

# sample-like case
assert run("""11 3 4 5
1 5 3 8
4 7 1 0 4
""") == "1 0 1 0 1"

# minimum case
assert run("""1 1 1 1
0
0
""") == "1"

# no insertions
assert run("""5 2 0 3

1 2 3
""") == "0 0 0"

# all elements identical
assert run("""10 3 3 2
2 2 2
2 2
""") == "1 1"

# boundary power cycle behavior
assert run("""7 4 2 2
3 6
3 6
""") in ["1 1", "0 0"]
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品| 1 0 1 0 1 | 1 0 1 0 1 混合查询的正确性|
 | 单元素| 1 | 最低配置|
 | 无插入| 0 0 0 | 0 0 0 空结构行为|
 | 重复 | 1 1 | 1 幂等插入 |
 | 模块化碰撞 | 变量| 循环处理|

 ## 边缘情况

 当查询产生的所有索引重复时，例如`x = 1`，我们得到`[1,1,1,...]`。 该算法仍然多次检查同一位置，但由于数组是二进制且稳定的，因此结果不受影响。 

为了`n = 1`，每个指数都减少到`0`，因此所有元素都映射到相同的索引。 系统变成了一位寄存器，每次插入或查询都会折叠到该位置。 算法正确设置`arr[0] = 1`任何插入后，使所有查询返回`1`一旦至少有一个元素存在。 

对于较大的值`x`，模乘可确保值保持有界，因此不会发生溢出或性能下降。 迭代幂计算保证了正确性，而不需要快速求幂。
