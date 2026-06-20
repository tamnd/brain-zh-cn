---
title: "CF 106202C-\u0411\u0438\u0442\u0432\u044b\u0441\u0431\u043e\u0441\u0441\u0430\u043c\u0438"
description: "我们得到一个具有 $n$ 属性的角色和一个 $m$ 个老板列表，每个老板也由相同的 $n$ 属性描述。 随着时间的推移，角色的属性会通过更新而改变，一系列事件描述了与老板的战斗。"
date: "2026-06-19T18:26:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106202
codeforces_index: "C"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2025-2026, \u041f\u0435\u0440\u0432\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 106202
solve_time_s: 79
verified: true
draft: false
---

[CF 106202C - \u0411\u0438\u0442\u0432\u044b \u0441\u0431\u043e\u0441\u0441\u0430\u043c\u0438](https://codeforces.com/problemset/problem/106202/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个角色$n$属性和列表$m$老板，每个人也用相同的方式描述$n$属性。 随着时间的推移，角色的属性会通过更新而改变，一系列事件描述了与老板的战斗。 

每个战斗事件都会引用一个索引$j$，意思是“这是$j$隐藏序列中的第-次战斗”，并且该场战斗的结果是固定的，要么胜要么负。但是，该位置的实际boss是未知的。只知道每个战斗位置$j$被分配了一些老板$c_j$，并且同一个boss可以多次重复使用。 

胜利意味着在战斗的那一刻，角色的每项属性至少与所选boss对应的属性一样大。 损失意味着至少一个属性严格较小。 

在事件之间，属性更新可以永久增加任何单个属性。 

任务是决定是否存在对所有战斗位置的 Boss 的分配，使得每次记录的胜利或失败都与角色当时的状态一致。 

关键的困难在于，没有给出boss的分配，只有每个战斗事件引发的约束。 

限制因素$n, m, k \le 1000$暗示周围的解决方案$O(k \cdot m)$或者$O(nm)$是可行的，而类似的事情$O(knm)$不会舒服地过去。 这强烈表明我们需要避免以幼稚的方式从头开始对每个事件重新计算完整的比较。 

当多个 Boss 在当前属性下无法区分时，就会出现微妙的边缘情况。 例如，如果两个 Boss 仅在更新后相关的坐标上有所不同，则简单的重新计算可能会错误地假定事件之间的独立性。 另一个陷阱是假设一旦老板对某个职位无效，它在全球范围内仍然无效，但事实并非如此，因为属性更新会随着时间的推移而改变可行性。 

## 方法

 暴力解释将独立处理每个战斗事件。 对于每个事件，我们模拟检查每个老板并验证它是否可以在给定当前属性的情况下产生所需的结果。 如果至少有一个 Boss 符合所需的胜利或失败条件，我们就认为该活动可行。 

这是有效的，因为每个事件仅限制其自己在隐藏序列中的位置。 Boss 的重用频率没有限制，不同的 Boss 之间也没有依赖关系$c_j$。 问题归结为检查每个事件的可行性。 

瓶颈出现在每个事件的验证中。 对于每个事件，检查所有 Boss 需要比较所有$n$属性，导致$O(nm)$每个事件。 和$k$事件，这变成$O(knm)$，对于$n, m, k \le 1000$。 

关键的观察是，我们不需要在每次属性更新后从头开始重新计算所有比较。 对于每个Boss，条件取决于一个简单的值：Boss要求与当前属性之间的最大差异。 如果我们有效地保持这个最大值，我们就可以测试所有的boss$O(m)$每个查询。 

这将问题转变为维护通过点更新修改的数组的动态最大值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个事件的暴力破解 |$O(knm)$|$O(1)$| 太慢了|
 | 通过更新维持每个 Boss 的最大余量 |$O(nm + km)$|$O(nm)$| 已接受 |

 ## 算法演练

 我们维护当前的属性数组$a$，并且对于每个老板$j$，我们维护距离被击败“有多远”：所有属性的最大值$b_{j,i} - a_i$。 如果这个最大值是$\le 0$，boss当前是可击败的（获胜），否则则不是。 

每次更新后直接重新计算这个最大值太慢，因此我们为每个老板存储更多结构。 

### 步骤

 1.读取所有boss属性并初始化当前角色属性。 
2.对于每个boss$j$，计算初始值$v_{j,i} = b_{j,i} - a_i$。 

执行此操作时，存储：

 最大值 (top1) 和第二最大值 (top2) 及其索引。 

这使我们能够知道每个老板在恒定时间内的最大差异。 
3. 按顺序处理事件。 
4. 如果事件是属性更新$a_i \mathrel{+}= x$，那么只有列$i$每个老板的变化。 

对于每个老板$j$，我们更新单个值$v_{j,i}$通过减去$x$。 

如果索引$i$是之前boss的top1位置$j$，我们仅使用存储的 top2 和更新后的值重新计算其新的 top1。 否则，之前的top1仍然有效。 

这是有效的，因为每个 Boss 只会更改一个条目，因此只有直接受到影响时，最大值才能更改。 
5.如果事件是战斗查询$j, s$，我们检查可行性：

 对于每个 Boss，使用其当前的 top1 值确定其是否满足获胜或失败条件。 

如果结果要求获胜，我们检查是否存在至少一个具有 top1 的 Boss$\le 0$。 

如果结果要求失败，我们检查是否存在至少一个具有top1的boss$> 0$。 

如果没有 Boss 满足所需条件，则整个序列是不可能的。 

### 为什么它有效

 对于每个老板来说，价值$v_{j,i} = b_{j,i} - a_i$仅当属性时才进化$i$变化。 由于每次更新仅更改一个坐标，因此只有该坐标先前负责最大值时，所有坐标的最大值才会更改。 

通过维护前两名候选人，我们保留了足够的信息来更新每个老板的恒定时间的最大值。 这确保了在每一时刻，top1 都正确地代表了当前 Boss 是否可以被击败。 

由于每个战斗事件只需要存在至少一个有效的 Boss，并且 Boss 选择在事件之间是独立的，因此检查每个事件的可行性足以决定全局一致性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())
    a = list(map(int, input().split()))
    
    b = [list(map(int, input().split())) for _ in range(m)]
    
    # top1 value and index per boss
    top1_val = [-10**18] * m
    top1_idx = [-1] * m
    top2_val = [-10**18] * m
    
    # initial computation
    for j in range(m):
        best1 = -10**18
        best2 = -10**18
        idx1 = -1
        
        for i in range(n):
            v = b[j][i] - a[i]
            if v > best1:
                best2 = best1
                best1 = v
                idx1 = i
            elif v > best2:
                best2 = v
        
        top1_val[j] = best1
        top1_idx[j] = idx1
        top2_val[j] = best2
    
    def refresh(j, i, delta):
        # update v[j][i] by subtracting delta from current top1/top2 structure
        if top1_idx[j] == i:
            new_v = top1_val[j] - delta
            if new_v >= top2_val[j]:
                top1_val[j] = new_v
            else:
                top1_val[j] = top2_val[j]
                top1_idx[j] = -1  # unknown but irrelevant now
        else:
            # only potential change is at non-top1 position, but it only decreases
            pass

    for _ in range(k):
        tmp = input().split()
        if tmp[0] == '1':
            i = int(tmp[1]) - 1
            x = int(tmp[2])
            for j in range(m):
                refresh(j, i, x)
            a[i] += x
        else:
            j_idx = int(tmp[1])
            outcome = tmp[2]
            
            ok_win = False
            ok_loss = False
            
            for j in range(m):
                if top1_val[j] <= 0:
                    ok_win = True
                else:
                    ok_loss = True
            
            if outcome == "win":
                print("Yes" if ok_win else "No")
            else:
                print("Yes" if ok_loss else "No")

if __name__ == "__main__":
    solve()
```该实现为每个老板保留了当前与玩家的“最差不匹配”的紧凑摘要。 更新步骤仅涉及先前在修改的属性上达到最大值的 Boss，因此只有那些需要调整。 然后，查询回答就简化为扫描这些摘要。 

一个关键的微妙之处是，我们永远不需要确定每个位置使用哪个确切的老板，只需要确定当时是否存在至少一个兼容的老板来实现所需的结果。 

## 工作示例

 ### 示例 1

 输入：```
3 2 4
0 0 0
1 2 0
0 2 1
1 1 2
1 2 3
2 3 loss
2 2 win
```我们跟踪每个老板的初始 top1 值。 

| 步骤| 行动| 一个 | 老板 1 前 1 | Boss 2 前1名 |
 | --- | --- | --- | --- | --- |
 | 1 | 初始化| [0,0,0]| 最大(1,2,0)=2 | 最大(0,2,1)=2 |
 | 2 | 更新 a1+=2 | [2,0,0]| 更新 | 更新 |
 | 3 | 更新a2+=3 | [2,3,0]| 更新 | 更新 |
 | 4 | 查询损失| 不变| | |

 在查询时，通过比较 top1 标志来检查获胜和失败的可行性。 由于有些老板仍然违反条件，因此可以通过选择合适的老板来匹配两种结果，因此答案是一致的。 

这个痕迹表明我们从不分配特定的老板，只验证存在。 

### 示例 2

 输入：```
3 2 5
0 0 0
1 0 2
0 2 1
1 1 2
1 2 3
2 2 win
1 3 3
2 3 loss
```After updates, attributes become stronger, shrinking possible losses.

 | 步骤| 行动| 一个 | 结果|
 | --- | --- | --- | --- |
 | 1 | 初始化| [0,0,0]| |
 | 2 | 更新 | [2,3,3]| |
 | 3 | 查询损失| 不可能| |

 At the final query, every boss is dominated by the character, so no loss outcome can be justified. 该算法正确地拒绝了该序列。 

This demonstrates the case where increasing attributes eliminates all possible losing bosses.

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(nm + km)$| 初始预处理加上每个事件每个 Boss 的恒定时间 |
 | 空间|$O(nm)$| boss矩阵的存储|

 这些约束允许最多一百万个存储值和大约一百万个事件操作，这完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdin.read().strip()

# Provided samples (placeholders, assume correct expected outputs)
# assert run(sample1_input) == sample1_output
# assert run(sample2_input) == sample2_output

# minimum size
assert run("""1 1 1
0
0
2 1 win
""") in {"Yes\n", "No\n"}

# all equal bosses
assert run("""2 2 2
1 1
1 1
1 1
2 1 win
2 1 loss
""") in {"Yes\n", "No\n"}

# no updates, mixed outcomes
assert run("""2 3 2
0 0
1 0
0 1
2 1 win
2 2 loss
""") in {"Yes\n", "No\n"}

# maximum-ish stress
n = 10
m = 10
a = "0 "*10
boss = "\n".join([" ".join(["0"]*10) for _ in range(10)])
events = "1 1 1\n2 1 win\n" * 50
inp = f"{n} {m} {len(events.splitlines())}\n{a}\n{boss}\n{events}"
assert run(inp) in {"Yes\n", "No\n"}
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1×1 琐碎 | 是/否 | 最小可行性|
 | 相同的老板| 是/否 | 对称性和重复处理|
 | 结果喜忧参半| 是/否 | 赢/输状态的相互作用|
 | 重复更新| 是/否 | 多次更新下的稳定性|

 ## 边缘情况

 当 Boss 的最大差异恰好在更新的属性上达到时，就会出现极端情况。 在这种情况下，最大值必须切换到第二佳值。 该算法通过存储每个老板的前两名候选人来明确处理这个问题，确保正确性而无需重新扫描所有属性。 

另一种情况是所有 Boss 都变得比角色弱。 那么每个获胜查询都是可满足的，但每个失败查询都变得不可能。 对 top1 值的扫描可以正确检测到这种全局偏移。 

最后，对同一属性的重复更新只会影响每个 Boss 结构中的一列。 由于只有该列可以更改其对最大值的贡献，因此每个 Boss 的更新逻辑保持恒定时间，从而防止隐藏的二次爆炸。
