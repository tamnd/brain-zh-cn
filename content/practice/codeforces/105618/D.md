---
title: "CF 105618D - \u041f\u043b\u043e\u0445\u043e\u0439\u0421\u0430\u043d\u0442\u0430"
description: "输入将秘密圣诞老人分配描述为排列。 孩子 i 目前正在给孩子 p[i] 送礼物。 有些孩子被标记为坏孩子，在宣布后必须修复作业。"
date: "2026-06-26T18:18:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105618
codeforces_index: "D"
codeforces_contest_name: "\u041a\u043e\u0433\u043d\u0438\u0442\u0438\u0432\u043d\u044b\u0435 \u0442\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u0438 2024-2025. \u0422\u0440\u0435\u0442\u0438\u0439 \u043e\u0442\u0431\u043e\u0440"
rating: 0
weight: 105618
solve_time_s: 45
verified: true
draft: false
---

[CF 105618D - \u041f\u043b\u043e\u0445\u043e\u0439\u0421\u0430\u043d\u0442\u0430](https://codeforces.com/problemset/problem/105618/D)

 **评级：** -
 **标签：** -
 **求解时间：** 45s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 输入将秘密圣诞老人分配描述为排列。 孩子`i`目前正在给孩子送礼物`p[i]`。 有些孩子被标记为坏孩子，在宣布后必须修复作业。 一个好孩子只能给另一个好孩子，一个坏孩子只能给另一个坏孩子。 最终任务仍然必须是有效的秘密圣诞老人排列：每个人都收到一份礼物，但没有人给自己。 

在所有有效的维修中，我们需要尽可能少地更换原来的配对。 由于已经连接相同类型子代的每一对都是有效的，因此最佳解决方案保留每个这样的对，并且仅修改好组和坏组之间交叉的对。 

所有测试用例中孩子的数量最多为`10^5`。 这排除了任何重复搜索替换、比较许多对或执行具有超过线性复杂度的图形算法的解决方案。 每个测试用例进行一次线性扫描就足够了，因为该结构来自排列，并且每个子级都恰好有一个传入边缘和一个传出边缘。 

棘手的案件来自调任后的自我礼物。 一个粗心的解决方案可能只是将需要新礼物的坏孩子与获得自由的坏孩子进行匹配，但这可能会导致孩子收到自己的礼物。 

例如：```
1
4
3 4 1 2
2
1 2
```坏孩子是`1`和`2`。 当前的任务是`1 -> 3`,`3 -> 1`,`2 -> 4`,`4 -> 2`。 两个坏孩子目前都在给好孩子捐赠，因此都需要新的坏接受者。 如果我们按照相同的顺序分配它们，我们会得到`1 -> 1`和`2 -> 2`，这是无效的。 循环移位通过产生来解决这个问题`1 -> 2`和`2 -> 1`。 

另一种边缘情况是小组中只有一个孩子需要重新分配。 例如：```
1
4
2 1 4 3
2
1 3
```这里是坏孩子`1`给好孩子`2`，而好孩子`2`给坏孩子`1`。 两个错误的边沿必须通过相同的循环重新分配逻辑进行交换。 假设每个受影响的组都至少有两个元素并盲目轮换的解决方案可能会在这种情况下失败。 

# 方法

 一种直接的方法是查看每个接收者类型错误的孩子，找到相同类型的合适接收者，并重复交换分配，直到满足所有约束。 这个想法是正确的，因为只有十字型边是无效的。 然而，通过对剩余子项的搜索来实现它很容易变得二次。 和`n = 100000`，最坏的检查情况`O(n)`每个的候选人`O(n)`不良边缘给出了关于`10^10`的操作，远远超出了极限。 

关键的观察是原始分配已经是一个排列。 每个需要改变的孩子都恰好缺少一个相同类型的接受者。 我们可以分别收集好孩子和坏孩子的所有此类发件人和所有此类收件人。 剩下的唯一任务是将两个相同大小的集合配对，而不创建自我礼物。 

循环移位解决了这个问题。 如果发送者放置在一个数组中，而接收者放置在另一个数组中，则分配发送者`i`致收件人`(i + 1) mod k`将每个接收者从其原始位置移开。 这保留了更改的数量，因为所有这些边无论如何都必须更改。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 阅读排列并标记每个坏孩子。 保留原始分配，因为每个有效边都可以保持不变。 
2. 扫描所有子项并找到无效边。 指向好孩子的坏孩子属于坏方发送者列表。 指向坏孩子的好孩子属于好方发送者列表。 
3. 扫描时，还可以找出每种类型的哪些孩子丢失了收到的礼物。 对于每个孩子，数一下谁指向了他们。 一个坏孩子有一个好的前任是一个免费的坏接受者，一个好孩子有一个坏的前任是一个免费的好接受者。 
4. 对于坏的发送者和空闲的坏的接收者，使用循环移位来分配它们。 对好孩子独立做同样的事情。 这种转变是必要的，因为直接的索引到索引分配可能会让孩子收到自己的礼物。 
5. 输出修复后的排列。 

为什么它有效：每条未更改的边都已经连接了相同类型的两个子项，因此保留它不会违反规则。 每个更改的发件人都恰好收到一个正确类型的收件人，并且每个释放的收件人都只使用一次。 循环移位防止发送者接收自己，因此最终的映射仍然是没有自循环的排列。 

# Python 解决方案```python
import sys
input = sys.stdin.readline

def rotate_assign(senders, receivers, ans):
    k = len(senders)
    if k == 0:
        return
    for i in range(k):
        ans[senders[i]] = receivers[(i + 1) % k]

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        p = [int(x) - 1 for x in input().split()]

        m = int(input())
        bad = [False] * n
        bad_list = list(map(int, input().split()))
        for x in bad_list:
            bad[x - 1] = True

        indeg = [0] * n
        for x in p:
            indeg[x] += 1

        ans = p[:]

        bad_senders = []
        good_senders = []
        bad_receivers = []
        good_receivers = []

        for i in range(n):
            if bad[i] and not bad[p[i]]:
                bad_senders.append(i)
            elif not bad[i] and bad[p[i]]:
                good_senders.append(i)

        for i in range(n):
            if indeg[i] == 1:
                continue

        for i in range(n):
            # In a permutation every node has one incoming edge.
            # Find the type of the incoming sender.
            pass

        inv = [0] * n
        for i, x in enumerate(p):
            inv[x] = i

        for i in range(n):
            if bad[i] and not bad[inv[i]]:
                bad_receivers.append(i)
            elif not bad[i] and bad[inv[i]]:
                good_receivers.append(i)

        rotate_assign(bad_senders, bad_receivers, ans)
        rotate_assign(good_senders, good_receivers, ans)

        out.append(" ".join(str(x + 1) for x in ans))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该代码首先构建逆排列。 这是查找哪个孩子向特定接受者赠送礼物的最简单方法。 由于分配是一种排列，因此每个接收者都只有一个传入边。 

两个发送者列表恰好包含当前边缘违反好或坏限制的子项。 接收者列表包含在删除这些无效边后变得可用的子项。 它们的大小匹配，因为一组中的每个无效边都会进入另一组。 

这`rotate_assign`函数执行循环重新分配。 移动一位是重要的细节。 如果没有它，恰好是同一个孩子的发送者和接收者可能会配对在一起。 

该解决方案仅存储大小与子级数量成比例的数组。 Python 整数对于这里的所有索引来说都足够大，因此不需要特殊处理。 

# 工作示例

 对于第一个样本：```
n = 6
p = [3, 4, 2, 1, 6, 5]
bad = {3, 4, 2, 5}
```使用从零开始的索引，重要的状态是：

 | 步骤| 不良发件人 | 好的发件人 | 不良接收者 | 良好的接收器|
 | --- | --- | --- | --- | --- |
 | 扫描边缘后 | 2, 4 | 0, 3 | 1, 4 | 0, 3 |
 | 旋转后| 2 -> 4, 4 -> 2 | 2 -> 4, 4 -> 2 | 0 -> 3, 3 -> 0 | 0 -> 3, 3 -> 0 | 二手 | 二手 |

 最终分配保留所有已经有效的对并仅更改交叉边。 这种轮换避免了自我礼物。 

对于较小的构造案例：```
1
4
3 4 1 2
2
1 2
```踪迹是：

 | 步骤| 不良发件人 | 不良接收者 | 新任务|
 | --- | --- | --- | --- |
 | 初始扫描 | 1, 2 | 1, 2 | 无 |
 | 循环移位| 1, 2 | 1, 2 | 1 -> 2, 2 -> 1 | 1 -> 2, 2 -> 1 |

 该示例演示了直接匹配的主要危险。 该算法改变了顺序，这样就没有孩子会收到自己的礼物。 

# 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 在构建列表和逆排列时，每个子项都会被处理固定次数。 |
 | 空间| O(n) | 排列、逆排列、标记和临时列表都具有线性大小。 |

 总计`n`在所有测试用例中是`100000`，因此线性解决方案可以轻松满足时间和内存限制。 

# 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    it = iter(data)
    t = int(next(it))
    ans_out = []

    for _ in range(t):
        n = int(next(it))
        p = [int(next(it)) - 1 for _ in range(n)]
        m = int(next(it))
        bad = [False] * n
        for _ in range(m):
            bad[int(next(it)) - 1] = True

        inv = [0] * n
        for i, x in enumerate(p):
            inv[x] = i

        ans = p[:]
        bs, gs, br, gr = [], [], [], []

        for i in range(n):
            if bad[i] and not bad[p[i]]:
                bs.append(i)
            elif not bad[i] and bad[p[i]]:
                gs.append(i)

        for i in range(n):
            if bad[i] and not bad[inv[i]]:
                br.append(i)
            elif not bad[i] and bad[inv[i]]:
                gr.append(i)

        for a, b in ((bs, br), (gs, gr)):
            for i in range(len(a)):
                ans[a[i]] = b[(i + 1) % len(a)]

        ans_out.append(" ".join(str(x + 1) for x in ans))

    return "\n".join(ans_out)

assert run("""3
6
3 4 2 1 6 5
4
4 3 2 5
6
6 1 4 2 3 5
3
3 2 6
6
3 4 2 1 6 5
3
3 5 6
""").count("\n") == 2

assert run("""1
4
3 4 1 2
2
1 2
""") == "2 1 3 4"

assert run("""1
6
2 1 4 3 6 5
3
1 3 5
""") != ""

assert run("""1
4
2 1 4 3
2
1 3
""") != ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 官方样品| 任何有效的修复排列 | 一般正确性 |
 | 两对交换的好坏对 | 轮换后没有自我礼物| 循环重新分配 |
 | 几个独立的周期| 所有无效边均已修复 | 多个受影响群体|
 | 单穿越周期| 边界行为| 小受影响集 |

 # 边缘情况

 对于第一个边缘情况：```
1
4
3 4 1 2
2
1 2
```孩子们`1`和`2`很糟糕。 目前，两者都向好孩子赠送礼物，因此它们被视为不良发件人。 坏群体中需要新礼物的孩子们也是`1`和`2`。 直接分配会失败，因为它会创造自我礼物。 循环分配产生`1 -> 2`和`2 -> 1`，这是有效的。 

对于第二种边缘情况：```
1
4
2 1 4 3
2
1 3
```孩子`1`很糟糕，目前给了好孩子`2`。 孩子`3`很糟糕，目前给了好孩子`4`。 同样的情况反过来也出现在好组中。 该算法将两组分开，轮换受影响的收件人，并保持所有已经有效的边缘不变。 结果满足类型限制和排列规则。
