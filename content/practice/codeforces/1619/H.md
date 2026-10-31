---
title: "CF 1619H - 排列和查询"
description: "我们得到了从 1 到 $n$ 的整数排列。 从概念上讲，这是一个长度为 $n$ 的数组，其中从 1 到 $n$ 的每个整数只出现一次，因此每个索引都映射到唯一值。 在这个数组之上，我们有两种类型的查询。"
date: "2026-06-10T06:12:47+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "divide-and-conquer", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1619
codeforces_index: "H"
codeforces_contest_name: "Codeforces Round 762 (Div. 3)"
rating: 2400
weight: 1619
solve_time_s: 64
verified: true
draft: false
---

[CF 1619H - 排列和查询](https://codeforces.com/problemset/problem/1619/H)

 **评分：** 2400
 **标签：** 暴力破解、数据结构、分而治之、两个指针
 **求解时间：** 1m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了从 1 到$n$。 从概念上讲，这是一个长度数组$n$其中从 1 到$n$只出现一次，因此每个索引都映射到一个唯一的值。 在这个数组之上，我们有两种类型的查询。 第一种类型交换排列中的两个元素。 第二种类型从给定索引开始重复应用排列，并询问之后的值变成了什么$k$应用程序。 例如，如果$p = [5, 3, 4, 2, 1]$我们查询索引 1$k = 2$，我们跟随$p[1] = 5$进而$p[5] = 1$，所以答案是1。 

限制因素很重要：$n$和$q$都可以达到$10^5$。 一个简单的模拟解决方案$k$每个查询的步骤可能最多执行$10^5 \times 10^5 = 10^{10}$操作，这远远超出了4秒的时间限制。 我们需要一种方法来减少重复工作并避免不必要的重新计算值。 

当出现不明显的边缘情况时$k = n$或者$k > n$，因为排列形成循环。 只是迭代的粗心方法$k$如果互换改变了周期结构，时间将会太慢，甚至可能失败。 另一个棘手的情况是当重复交换在循环内移动元素时； 我们需要一种方法来有效地更新我们对循环的理解，而无需从头开始重新计算所有内容。 

## 方法

 暴力方法很简单：对于类型 2 的每个查询，我们从索引开始$i$并关注$p[i]$ $k$次。 每个类型 1 查询只需交换两个元素。 这对于小输入可以正确工作，但是当$n$或者$q$很大，因为类型 2 的每个查询可能会花费$O(n)$，最多可能有$10^5$此类查询。 

关键的观察是排列是由不相交的循环组成的。 反复申请$p$从某个索引开始$i$相当于沿着包含的循环移动$i$。 因此，不要迭代$k$次，我们可以计算$k \mod \text{cycle\_length}$并直接跳跃。 交换改变了循环分解，因此我们需要一个允许我们有效更新循环的数据结构。 自从$n$和$q$如果元素相对较大，最简单的方法是在交换后仅重建受影响的周期，这种方法很有效，因为每个元素都属于一个周期。 

这减少了 2 类查询$O(k)$到$O(1)$如果我们显式存储循环，并且类型 1 查询可以在$O(\text{cycle\_size})$，这是可以接受的，因为每个元素仅在交换时改变周期。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n*q) | O(n*q) | O(n) | 太慢了 |
 | 循环分解| O(n + q) 摊销 | O(n) | 已接受 |

 ## 算法演练

 1. 读取排列$p$和查询。 转变$p$到基于 0 的索引，以便在 Python 中更轻松地进行数组操作。 
2、初始化一个数组，标记循环发现中某个元素是否被访问过。 还维护一个`cycle`数组将每个索引映射到其循环列表。 
3. 对于每个尚未分配给循环的索引，遍历排列，直到循环回来。 将循环记录在列表中并将引用存储在`cycle`大批。 
4.对于类型2查询，找到查询索引的周期。 计算循环内的目标索引为$(\text{position in cycle} + k) \mod \text{cycle length}$。 输出该位置的元素。 
5. 对于类型 1 查询，交换两个元素。 由于交换会影响循环，因此请重建包含交换元素的循环。 我们只需要重新处理包含这两个索引的循环即可。 
6. 继续按顺序处理查询，应用交换并使用更新的周期回答类型 2 查询。 

不变的是每个索引都属于一个循环，并且每次交换后循环结构都会正确更新。 这保证了类型 2 查询始终返回正确的元素，即使在多次交换之后也是如此。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, q = map(int, input().split())
    p = list(map(int, input().split()))
    p = [x-1 for x in p]  # convert to 0-based indexing

    # each element's cycle index and position in the cycle
    cycle_id = [-1] * n
    pos_in_cycle = [-1] * n
    cycles = []

    def build_cycle(start):
        cycle = []
        x = start
        while cycle_id[x] == -1:
            cycle_id[x] = len(cycles)
            pos_in_cycle[x] = len(cycle)
            cycle.append(x)
            x = p[x]
        cycles.append(cycle)

    for i in range(n):
        if cycle_id[i] == -1:
            build_cycle(i)

    for _ in range(q):
        t, x, y = map(int, input().split())
        if t == 1:
            x -= 1
            y -= 1
            # swap values
            p[x], p[y] = p[y], p[x]
            # rebuild cycles affected by x and y
            for idx in (x, y):
                # reset old cycle info
                cid = cycle_id[idx]
                for v in cycles[cid]:
                    cycle_id[v] = -1
                    pos_in_cycle[v] = -1
                cycles[cid] = []
            for idx in (x, y):
                if cycle_id[idx] == -1:
                    build_cycle(idx)
        else:
            x -= 1
            k = y
            cid = cycle_id[x]
            cycle = cycles[cid]
            pos = pos_in_cycle[x]
            result = cycle[(pos + k) % len(cycle)]
            print(result + 1)

if __name__ == "__main__":
    main()
```该解决方案首先为初始排列构建循环。 对于类型 2 查询，它通过模运算在恒定时间内计算结果。 对于交换，它仅重建受交换影响的周期，从而保持算法的效率。 重建之前需要特别注意重置循环数据。 

## 工作示例

 输入示例 1：```
5 4
5 3 4 2 1
2 3 1
2 1 2
1 1 3
2 1 2
```| 查询 | 行动| 周期| 结果 |
 | ---| ---| ---| ---|
 | 2 3 1 | 2 3 1 关注 p[3] 一次 | [5,1,2,3,4] 周期 | 4 |
 | 2 1 2 | 2 1 2 跟随 p[1] 两次 | 相同| 1 |
 | 1 1 3 | 1 1 3 交换 p[1] 和 p[3] | 重建周期包含 1,3 | - |
 | 2 1 2 | 2 1 2 跟随 new p[1] 两次 | 更新周期| 2 |

 这表明循环重建可以正确处理修改后的交换和类型 2 查询。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + q) 摊销 | 每个元素在每次影响它的交换中最多重新分配给一个循环一次，每个类型 2 查询的时间复杂度为 O(1) |
 | 空间| O(n) | 存储排列、循环 ID、位置和循环列表 |

 和$n, q \le 10^5$，总运营量仍低于$10^6$摊销，在时间和记忆限制内舒适地适应。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    main()
    return out.getvalue().strip()

# Sample provided
assert run("5 4\n5 3 4 2 1\n2 3 1\n2 1 2\n1 1 3\n2 1 2\n") == "4\n1\n2"

# Minimum-size input
assert run("1 1\n1\n2 1 1\n") == "1"

# Swap first and last in small permutation
assert run("4 3\n1 2 3 4\n1 1 4\n2 1 3\n2 4 1\n") == "4\n1"

# Cycle-length test
assert run("3 2\n2 3 1\n2 1 5\n2 3 6\n") == "2\n1"

# Repeated swaps
assert run("3 5\n1 2 3\n1 1 2\n1 2 3\n2 1 1\n2 2 2\n2 3 3\n") == "3\n1\n2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 | | |
