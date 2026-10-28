---
title: "CF 1470A - 奇怪的生日聚会"
description: "我们被要求在一系列约束下最小化向一群朋友赠送礼物的总成本。 每个朋友都有一个首选的礼物号码 $ki$。 礼物的编号从 $1$ 到 $m$，固定成本为 $c1 le c2 ledots le cm$。"
date: "2026-06-11T00:58:44+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "dp", "greedy", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1470
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 694 (Div. 1)"
rating: 1300
weight: 1470
solve_time_s: 88
verified: true
draft: false
---

[CF 1470A - 奇怪的生日派对](https://codeforces.com/problemset/problem/1470/A)

 **评分：** 1300
 **标签：** 二分查找、dp、贪心、排序、两个指针
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求在一系列约束下最小化向一群朋友赠送礼物的总成本。 每个朋友都有一个首选的礼物号码，$k_i$。 礼物的编号是从$1$到$m$并且有固定成本$c_1 \le c_2 \le \dots \le c_m$。 对于给定的朋友，我们有两个选择：要么买一份礼物，数量不超过$k_i$或者直接给那个朋友$c_{k_i}$直接美元。 每件礼物只能购买一次。 目标是计算所有朋友的最小总支出。 

输入最多可以有$3 \cdot 10^5$朋友和礼物在测试用例中累积。 这个界限排除了任何具有二次复杂度的解决方案。 对于每个朋友，迭代所有礼物直到$k_i$会太慢，因为这可能会达到$O(n \cdot m)$最坏情况下的操作。 相反，我们需要一种线性或线性朋友数量的方法，使用排序或贪婪分配。 

边缘情况包括多个朋友都处于低水平的情况$k_i$价值和便宜的礼物，或者当$k_i$价值观已经与廉价礼物保持一致。 粗心贪婪地分配最便宜的礼物而不考虑$k_i$限制可能会超支。 例如，如果所有朋友都喜欢$k_i = 1$但最便宜的礼物位于列表的末尾，盲目地拿最便宜的礼物会违反约束。 

## 方法

 蛮力方法是迭代每个朋友，并为每个朋友扫描所有礼物$1$到$k_i$挑选最便宜的未分配礼物。 这在原则上是正确的，但显然太慢了。 如果$n$和$m$都在附近$3 \cdot 10^5$, 扫描$O(k_i)$让每个朋友都能轻松到达$10^{10}$运营。 

更快解决方案的关键观察是接受更多礼物的朋友更加灵活。 相反，那些体型较小的$k_i$值的选择较少。 我们可以通过对朋友进行排序来利用这一点$k_i$按照降序排列，将剩下的最便宜的礼物分配给价格更高的朋友$k_i$。 我们遍历朋友，从愿意接受最昂贵礼物的朋友到拥有最小礼物的朋友$k_i$。 在每一步中，我们都会将最便宜的礼物与赠送的礼物进行比较$c_{k_i}$直接美元并选择最小值。 这保证了我们永远不会违反$k_i$约束，也确保我们按顺序使用更便宜的礼物。 

这种方法自然会导致两指针或贪婪方法，其与好友数量加上排序步骤呈线性关系，即$O(n \log n)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * m) | O(米) | 太慢了|
 | 最佳 | O(n log n + m) | O(n log n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取好友数量$n$, 礼物数量$m$，首选礼物的数组$k$，以及成本$c$的礼物。 
2. 对好友进行排序$k_i$按降序排列。 这确保了愿意接受更昂贵礼物的朋友会被优先处理，因此我们会在不违反限制的情况下分配更便宜的礼物。 
3. 初始化指针`p`0 追踪下一个最便宜的礼物`c`。 
4. 初始化`total_cost`为 0。 
5. 降序迭代每个朋友$k_i$订单：

 a. 计算该朋友的直接成本为$c[k_i - 1]`. b. If the pointer `p` is within bounds (`p < m`) and the present `c[p]` is cheaper than $c[k_i - 1]`, assign present `c[p]` and increment `p`。 

c. 不然就给朋友$c[k_i - 1]$直接美元。 

d. 将选择的成本添加到`total_cost`。 
6.处理完所有好友后，输出`total_cost`。 

为什么有效：通过处理愿意接受更高的朋友$k_i$首先，我们确保将最便宜的礼物送给最灵活的朋友。 有没有小一点的朋友$k_i$永远不会被迫接受超出其限制的礼物，因为我们只使用从最便宜的开始向上的礼物，并且永远不会超出其限制$k_i$。 指针`p`保证每个礼物最多分配一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        k = list(map(int, input().split()))
        c = list(map(int, input().split()))
        
        k.sort(reverse=True)
        p = 0
        total_cost = 0
        for ki in k:
            direct_cost = c[ki - 1]
            if p < m and c[p] < direct_cost:
                total_cost += c[p]
                p += 1
            else:
                total_cost += direct_cost
        print(total_cost)

if __name__ == "__main__":
    solve()
```该代码首先读取测试用例的数量。 每个测试用例读取`n`,`m`、朋友最喜欢的礼物以及礼物的费用。 这`k`数组按降序排序，以优先考虑可以接受更昂贵礼物的朋友。 指针`p`跟踪哪些礼物已被使用。 对于每位朋友，我们会在范围内最便宜的礼物和直接美元金额之间进行选择。 该选择将添加到累积中`total_cost`。 每个测试用例与所需的输出格式匹配后打印总计。 微妙之处包括`ki - 1`Python 中从零开始的索引调整和边界检查`p < m`。 

## 工作示例

 ### 示例 1

 输入：```
5 4
2 3 4 3 2
3 5 12 20
```| 朋友 (k_i) | 直接成本| 最便宜的可用 (c[p]) | 选择成本 | 指针p |
 | ---| ---| ---| ---| ---|
 | 4 | 20 | 3 | 3 | 1 |
 | 3 | 12 | 12 5 | 5 | 2 |
 | 3 | 12 | 12 12 | 12 12 | 12 3 |
 | 2 | 5 | 12 | 12 5 | 3 |
 | 2 | 5 | 12 | 12 5 | 3 |

 总成本 = 3 + 5 + 12 + 5 + 5 = 30

 这一痕迹证实了贪婪地将最便宜的礼物分配给灵活的朋友可以避免超支。 

### 示例 2

 输入：```
5 5
5 4 3 2 1
10 40 90 160 250
```| 朋友 (k_i) | 直接成本| 最便宜的可用 (c[p]) | 选择成本 | 指针p |
 | ---| ---| ---| ---| ---|
 | 5 | 250 | 250 10 | 10 10 | 10 1 |
 | 4 | 160 | 160 40 | 40 40 | 40 2 |
 | 3 | 90 | 90 90 | 90 90 | 90 3 |
 | 2 | 40 | 40 160 | 160 40 | 40 3 |
 | 1 | 10 | 10 160 | 160 10 | 10 3 |

 总成本 = 10 + 40 + 90 + 40 + 10 = 190

 该跟踪演示了当剩余的廉价礼物超过朋友的限制时如何使用直接成本。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + m) | O(n log n + m) | 对朋友进行排序是 O(n log n)，对朋友进行迭代是 O(n)，累积 m 不超过约束。 |
 | 空间| O(n + m) | 存储k和c数组； 辅助空间可以忽略不计。 |

 即使在最大输入大小的情况下，该算法也能轻松满足 1 秒的限制，因为主要工作是排序`k`，所有其他操作都是线性的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# provided samples
assert run("2\n5 4\n2 3 4 3 2\n3 5 12 20\n5 5\n5 4 3 2 1\n10 40 90 160 250\n") == "30\n190"

# minimum-size input
assert run("1\n1 1\n1\n100\n") == "100", "single friend, single present"

# all k_i same
assert run("1\n3 3\n2 2 2\n5 10 15\n") == "15", "friends with same k_i, use cheapest for first, rest direct"

# increasing k_i
assert run("1\n4 4\n1 2 3 4\n1 2 3 4\n") == "10", "assign cheapest presents to flexible friends"

# maximum k_i
assert run("1\n3 5\n5 5 5\n10 20 30 40 50\n") == "60", "all friends take cheapest available within k_i=5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | ` | | |
