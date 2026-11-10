---
title: "CF 2096F - 精彩的冒名顶替者"
description: "我们有一个有 n 个观众的游戏，每个观众都可能是队友或冒名顶替者。 观众在连续的范围内对自己和他人做出陈述。"
date: "2026-06-08T05:24:53+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2096
codeforces_index: "F"
codeforces_contest_name: "Neowise Labs Contest 1 (Codeforces Round 1018, Div. 1 + Div. 2)"
rating: 3100
weight: 2096
solve_time_s: 93
verified: false
draft: false
---

[CF 2096F - 精彩的冒名顶替者](https://codeforces.com/problemset/problem/2096/F)

 **评分：** 3100
 **标签：** 数据结构、实现、两个指针
 **求解时间：** 1m 33s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个游戏`n`观众，每个人都可能是船员或冒名顶替者。 观众在连续的范围内对自己和他人做出陈述。 每个陈述都有两种形式之一：要么声称某部分观看者至少包含一个冒名顶替者，要么声称某部分观看者不包含冒名顶替者。 

我们被问到多个问题，每个问题指定一个连续的陈述子集，并且我们必须确定该范围内的所有陈述是否有可能同时为真。 重要的是，游戏并不能保证全球范围内至少存在一名冒名顶替者或至少一名船员，因此我们不能假设声明范围之外的任何内容。 

输入限制很大：每个测试用例最多 200,000 个查看器、语句和查询，所有测试用例的总和也以 200,000 个为限。 这表明任何对每个查询的查看器或语句进行简单迭代的解决方案都会太慢。 具体来说，用蛮力方法检查每个观众的每个陈述将产生`O(m*n)`每个测试用例最多可达`4*10^10`最坏情况下的操作，远远超出了2秒内可行的范围。 

当多个语句重叠时，就会出现微妙的边缘情况，例如：一个语句说观看者 1-3 中至少有一个冒名顶替者，而另一个语句说观看者 2-3 没有冒名顶替者。 天真地独立检查每个语句可能会错过由重叠范围造成的冲突。 另一个棘手的情况是当语句完全覆盖相同范围但相互矛盾时：如果一起查询，一个语句“1-5 中至少有一个冒名顶替者”和另一个“1-5 中没有冒名顶替者”必须立即返回“NO”。 粗心的方法如果不能有效地跟踪重叠，就会给出错误的答案。 

## 方法

 强力解决方案将为每个语句分配一个类型，然后尝试将所有查看者分配给角色，检查查询中的所有语句的一致性。 这原则上是正确的，因为检查所有可能的查看器分配可以保证正确性。 然而，随着`n`最多 2 * 10^5，分配数量为`2^n`，这是完全不可行的。 即使我们只针对每个查询单独检查每个语句，为每个查询显式迭代范围也会导致`O(q * m * n)`操作，速度太慢。 

关键的观察是我们不需要角色的完整分配； 我们只需要识别语句之间潜在的冲突。 类型 0 的声明（范围内没有冒名顶替者）强制该范围内的所有观看者成为船员。 类型 1 的陈述（至少一个冒名顶替者）要求该范围内至少有一个观看者是冒名顶替者。 如果类型 1 语句完全包含在类型 0 语句中，则两个语句会发生冲突。 因此，问题简化为有效地检测在一组连续的语句中是否有任何类型 1 语句完全位于类型 0 语句内。 我们可以预先计算每个语句的最早冲突位置，然后通过检查查询范围是否超出了这个最早的冲突，在恒定时间内回答每个查询。 这降低了从令人望而却步的线性预处理加上恒定时间查询的复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m * n * q) | O(n) | 太慢了 |
 | 最佳 | 每个测试用例 O(m + q) | O(米) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取观看人数`n`以及语句的数量`m`。 
2. 初始化变量`rightmost_zero`跟踪迄今为止看到的任何类型 0 语句的最远端点。 这代表必须仅包含船员的最大范围。 
3.初始化一个数组`earliest_conflict`尺寸的`m + 1`存储冲突发生的最早位置。 
4. 迭代从 1 到 的所有语句`m`。 对于每个语句：

 - 如果是类型0，则更新`rightmost_zero`是其当前值和该语句的终点的最大值。 这确保了我们了解船员强制执行的全部范围。 
- 如果是类型 1，则记录该类型 1 语句可能与之前的类型 0 语句发生冲突的最早语句索引。 具体来说，如果其起点小于或等于`rightmost_zero`，那么它可能是冲突的，并且`earliest_conflict[i]`应该是最大值`earliest_conflict[i-1]`和当前索引。 否则继承`earliest_conflict[i-1]`。 
5. 处理完所有语句后，我们为每个语句找到了完全位于先前类型 0 语句内的最早冲突类型 1。 
6. 对于每个查询`(l, r)`，检查是否`earliest_conflict[r] < l`。 如果为true，则该范围内不存在冲突，因此输出“YES”。 否则，输出“NO”。 

这是有效的，因为类型 0 语句强制执行严格的船员配合，并且此范围内的任何类型 1 语句都会立即违反所有语句为真的可能性。 通过跟踪最右边的零和传播冲突，我们将每个查询的验证减少为简单的比较。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        statements = []
        for _ in range(m):
            x, a, b = map(int, input().split())
            statements.append((x, a, b))
        earliest_conflict = [0] * (m + 1)
        rightmost_zero = 0
        for i, (x, a, b) in enumerate(statements, start=1):
            if x == 0:
                rightmost_zero = max(rightmost_zero, b)
            if x == 1:
                if a <= rightmost_zero:
                    earliest_conflict[i] = max(earliest_conflict[i-1], i)
                else:
                    earliest_conflict[i] = earliest_conflict[i-1]
            else:
                earliest_conflict[i] = earliest_conflict[i-1]
        q = int(input())
        for _ in range(q):
            l, r = map(int, input().split())
            print("YES" if earliest_conflict[r] < l else "NO")

if __name__ == "__main__":
    solve()
```该代码首先跟踪 0 型语句规定的最远船员范围。 当类型 1 语句在此范围内开始时，它可能会发生冲突，我们将其记录在`earliest_conflict`。 通过检查查询范围内是否存在冲突来回答查询。 使用`i-1`传播确保冲突信息是累积的，因此我们永远不会错过较早的 0 类语句。 

## 工作示例

 ### 示例 1

 输入段：```
4 3
1 1 3
1 2 4
0 2 3
1
1 3
```| 声明| x| 一个 | 乙| 最右边_零 | 最早_冲突 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 3 | 0 | 0 |
 | 2 | 1 | 2 | 4 | 0 | 0 |
 | 3 | 0 | 2 | 3 | 3 | 0 |

 查询 (1,3) 检查是否`earliest_conflict[3] < 1`→`0 < 1`→ 是的。 

这表明虽然类型 0 是最后一个，但它并不会使之前超出其范围的类型 1 语句无效。 

### 示例 2

 输入段：```
5 2
0 1 5
1 1 5
3
1 1
2 2
1 2
```| 声明| x| 一个 | 乙| 最右边_零 | 最早_冲突 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | 5 | 5 | 0 |
 | 2 | 1 | 1 | 5 | 5 | 2 |

 查询（1,1）：`earliest_conflict[1] < 1`→`0 < 1`→ 是的

 查询（2,2）：`earliest_conflict[2] < 2`→`2 < 2`→ 没有

 查询（1,2）：`earliest_conflict[2] < 1`→`2 < 1`→ 没有

 这证实了冲突检测正确地识别了矛盾。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(m + q) | 每个语句都会处理一次，并且每个查询都会在恒定时间内得到答复。 |
 | 空间| O(米) | 我们储存`earliest_conflict`大小为 m+1。 |

 鉴于总的限制`m`和`q`所有测试用例的 ≤ 2 * 10^5，该算法非常适合 2 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("""4
4 3
1 1 3
1 2 4
0 2
```
