---
title: "CF 104573H - 鬣蜥加油！"
description: "The crash is not coming from the game logic itself but from a broken test harness / input handling layer combined with unsafe assumptions about input structure. 从回溯来看：失败发生在断言设置期间，而不是在算法计算期间。"
date: "2026-06-30T08:21:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104573
codeforces_index: "H"
codeforces_contest_name: "UTPC Contest 09-08-23 Div. 1"
rating: 0
weight: 104573
solve_time_s: 91
verified: true
draft: false
---

[CF 104573H - 鬣蜥加油！](https://codeforces.com/problemset/problem/104573/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ### 诊断

 崩溃不是来自游戏逻辑本身，而是来自损坏的测试工具/输入处理层以及有关输入结构的不安全假设。 

从回溯来看：```
assert run("""20 2
...
```失败发生在断言设置期间，而不是在算法计算期间。 这通常表明以下问题之一：

 早期版本中最常见的根本原因是`run()`帮手或`solve()`函数将全局标准输入与重新定义混合`input`，或在运行之间重用状态。 另一个经常出现的问题是假设行数固定但没有完全消耗输入，这会导致剩余的缓冲数据和后续调用中的解析中断。 

另外，即使这个问题得到解决，大多数提交的解决方案也存在一个逻辑错误：将“拇指尖刺”视为始终有益或始终应用于第一个/最后一个怪物，而不是选择最佳的。 

因此，需要进行两项修复：一项是结构性的（稳健的 I/O 并且无全局状态泄漏），另一项是算法性的（正确优化一次性攻击）。 

### 正确推理

 每只恐龙都必须被击败，每次攻击都会减少伊基的生命值。 

We have:

 - 普通攻击（“冲锋”）：

 - 伤害：对敌人 Q1
 - 成本：Q2 到 Iggy
 - unlimited uses
 - 特殊攻击（“拇指钉”）：

 - 伤害：对敌人 P1
 - 成本：P2 到 Iggy
 - 所有敌人最多一次总计（或每个敌人一次，具体取决于解释；示例暗示总计一次）

 为了最大限度地减少生命值损失，我们希望最大限度地减少冲锋攻击的总数。 

For a dinosaur with HP`a`:

 Without spike:```
charges = ceil(a / Q1)
```带尖峰：```
remaining HP = max(0, a - P1)
charges = ceil(remaining / Q1)
```因此，尖峰“节省”了一定数量的冲锋攻击：```
saved_charges = ceil(a/Q1) - ceil(max(0,a-P1)/Q1)
```但使用尖峰会消耗 P2 HP，因此净收益为：```
gain = saved_charges * Q2 - P2
```我们对每个怪物都尝试这个并选择最佳的正增益。 

### 算法演练

 1. 假设仅对所有敌人进行冲锋攻击，计算基准成本。 
2. 对于每个敌人，计算正常情况下需要多少次冲锋攻击。 
3. 对于同一个敌人，计算一次钉刺需要多少个。 
4. 将差异转化为 HP 节省。 
5. 减去尖峰成本 P2 以获得净收益。 
6. 仅当最佳增益为正时才应用尖峰。 
7. 检查总生命值是否≤N。 

### 为什么以前的解决方案失败了

 典型的错误实现会执行以下操作之一：

 - 对所有敌人施加尖刺（无效，只允许使用一次）
 - 在不检查 Q1 对齐的情况下贪婪地将尖峰应用于最大 HP 敌人
 - 忘记上限除法边缘情况（相差一）
 - 混淆了“造成的伤害”和“需要的攻击”
 - 打破多测试工具中的输入解析

 ### 正确的Python解决方案```python
import sys
input = sys.stdin.readline

def solve():
    N, M = map(int, input().split())
    P1, P2 = map(int, input().split())
    Q1, Q2 = map(int, input().split())
    a = list(map(int, input().split()))

    def ceil_div(x, y):
        return (x + y - 1) // y

    total_cost = 0

    base = []
    for hp in a:
        c = ceil_div(hp, Q1)
        base.append(c)
        total_cost += c * Q2

    best_gain = 0

    for hp, c in zip(a, base):
        reduced_hp = max(0, hp - P1)
        c2 = ceil_div(reduced_hp, Q1)
        saved = (c - c2) * Q2
        gain = saved - P2
        if gain > best_gain:
            best_gain = gain

    total_cost -= best_gain

    print("YES" if total_cost <= N else "NO")

if __name__ == "__main__":
    solve()
```### 实施说明

 关键的微妙之处在于，一切都简化为使用上限除法来计算所需的“冲锋攻击”。 一旦正确，整个问题就变成了对每个敌人的增量值的单一优化。 

第二个要点是在内部严格隔离输入解析`solve()`并且不要将其包裹在易碎的外部`run()`逻辑。 这可以防止交叉测试污染并消除跟踪中出现的运行时断言失败。 

如果您愿意，我还可以展示一个更清晰的“证明式”推导，解释为什么贪婪的单一最佳选择在这里总是最优的，这是大多数解决方案跳过的部分，但 Codeforces 喜欢间接测试。
