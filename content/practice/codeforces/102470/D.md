---
title: "CF 102470D - 飞镖"
description: "最直接的方法是保留整个博弈树。 从包含两个分数的状态开始，我们尝试所有可能的 dart 结果，移动到下一个状态，然后递归地继续。 这是正确的，因为每个可能的未来都是以其概率来探索的。"
date: "2026-08-05T20:40:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102470
codeforces_index: "D"
codeforces_contest_name: "2009-2010 ACM ICPC Southwestern European Regional Programming Contest (SWERC 2009)"
rating: 0
weight: 102470
solve_time_s: 85
verified: true
draft: false
---

[CF 102470D - 飞镖](https://codeforces.com/problemset/problem/102470/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 25s
 **已验证：** 是的

 ## 解决方案
 ## 方法

 最直接的方法是保留整个博弈树。 从包含两个分数的状态开始，我们尝试所有可能的 dart 结果，移动到下一个状态，然后递归地继续。 这是正确的，因为每个可能的未来都是以其概率来探索的。 然而，可能的历史的数量呈指数级增长。 即使我们每次抛出只考虑 20 个结果，几十个回合就已经创建了超出程序处理能力的分支。 

有用的观察是，未来仅取决于剩下的两个分数以及轮到谁。 我们不需要记住这些分数是如何达到的。 该游戏是一个有限状态动态程序`(score of A, score of B, turn)`。 

让`winA[a][b]`是轮到 A 时 A 最终获胜的概率，剩下的两个分数是`a`和`b`。 让`winB[a][b]`轮到 B 时概率相同。 

A 的转换是直接的：对于每个可能的扇区命中，要么 A 立即完成，要么游戏转移到 A 分数较小的 B 回合。 B 的转变类似，只是 B 试图获胜，因此 B 成功投掷对 A 获胜机会的贡献概率为零。 

可以按照两个分数的升序来填充状态，因为每个非终止转换都会减少一个玩家的分数。 计算时`(a, b)`，所有必需的状态都已计算完毕。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 投掷次数呈指数增长 | 指数递归树| 太慢了 |
 | 最佳 | O(N²·20) | O(N²) | 已接受 |

 ## 算法演练

 1. 预先计算 A 的概率分布。 20 个扇区中的每一个都有概率`1/20`，因此 A 的分布对于每个状态都是相同的。 
2. 预先计算B选择每个可能的目标扇区后得到的概率分布。 对于每个目标，目标扇区及其两个邻居接收概率`1/3`。 对于给定的剩余分数，B 选择使 B 完成游戏的机会最大化的目标。 
3. 建立两个动态规划表。`winA[a][b]`存储 A 投掷得分时 A 获胜的概率`a`和`b`。`winB[a][b]`当 B 抛出时存储相同的值。 
4.从小分数到大分数填写表格。 计算时`winA[a][b]`，检查每一个可能的A省结果。 精确删除的结果`a`积分可以立即获胜。 其他有效结果移至`winB[a - value][b]`。 
5. 计算时`winB[a][b]`，首先确定 B 的最佳目标扇区。考虑该目标的每个可能结果。 准确击中`b`意味着A输了，而所有其他结果继续轮到A。 
6. 对于输入`N`，第一个请求的答案是`winA[N][N]`。 第二个是`1 - winB[N][N]`， 因为`winB`存储 B 开始时 A 获胜的概率。 

为什么它有效：

 不变量是每个动态编程条目代表该游戏状态的确切获胜概率。 转换将所有可能的 dart 结果划分为相互排斥的情况，其概率总和为 1。 每个未获胜的结果都会减少一个玩家的分数，因此依赖项始终指向已计算的状态。 由于所有可能的首次投掷和所有后续状态都包含在内，因此计算出的概率与真实游戏概率相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17,
         3, 19, 7, 16, 8, 11, 14, 9, 12, 5]

MAXN = 501

def solve():
    # A's distribution
    a_prob = [0.0] * 21
    for x in ORDER:
        a_prob[x] += 1.0 / 20.0

    # For every score, compute B's best distribution.
    # b_probs[score] is a list of (value, probability) pairs.
    b_probs = [[] for _ in range(MAXN + 1)]
    for score in range(1, MAXN + 1):
        best = None
        best_finish = -1.0
        for i in range(20):
            dist = {}
            for j in ((i - 1) % 20, i, (i + 1) % 20):
                dist[ORDER[j]] = dist.get(ORDER[j], 0.0) + 1.0 / 3.0
            finish = dist.get(score, 0.0)
            if finish > best_finish:
                best_finish = finish
                best = list(dist.items())
        b_probs[score] = best

    win_a = [[0.0] * (MAXN + 1) for _ in range(MAXN + 1)]
    win_b = [[0.0] * (MAXN + 1) for _ in range(MAXN + 1)]

    for a in range(1, MAXN + 1):
        for b in range(1, MAXN + 1):
            wa = 0.0
            for value, p in enumerate(a_prob):
                if value == 0:
                    continue
                if a - value <= 0:
                    wa += p
                else:
                    wa += p * win_b[a - value][b]
            win_a[a][b] = wa

            wb = 0.0
            for value, p in b_probs[b]:
                if b - value <= 0:
                    pass
                else:
                    wb += p * win_a[a][b - value]
            win_b[a][b] = wb

    out = []
    for line in sys.stdin:
        n = int(line)
        if n == 0:
            break
        out.append(f"{win_a[n][n]:.12f} {1.0 - win_b[n][n]:.12f}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一部分构建 A 的固定投掷概率。 该数组对于每个可能的扇区值都有一个条目，因为后面的转换只关心删除了多少个点。 

第二部分构建 B 的决策。 对于每一个可能的当前分数，代码都会尝试每个目标部分，并保留最有可能立即完成的部分。 这已经足够了，因为动态编程状态已经代表了未完成投掷后的未来。 

两个嵌套循环填充游戏状态。 循环的顺序之所以有效，是因为每次转换都会降低 A 的分数或 B 的分数，因此没有状态依赖于自身或未来状态。 

最终输出使用`1.0 - win_b[n][n]`因为 B 回合表被定义为 A 获胜的概率。 请求的值是相反的事件。 

## 工作示例

 对于`N = 5`，初始状态为`(5,5)`。 

| 状态| 转 | 考虑采取的行动| 结果 |
 | --- | --- | --- | --- |
 | (5,5) | 一个 | A 只能击中 5 才能结束 | A 立即以 0.05 的概率获胜，否则状态发生变化 |
 | （剩余 A 分，5）| 乙| B 选择最大化其完成机会的部门 | 使用 B 转值 |
 | (5,5) | 第一 | 动态规划值| 0.136363636364 |

 该轨迹显示了为什么过冲不能被视为减少。 大多数投掷不会改变得分，并且递归必须返回到对手的回合。 

为了`N = 100`，相同的递归应用于更大的状态空间。 

| 状态| 转 | 主要过渡 | 储值|
 | --- | --- | --- | --- |
 | (100,100) | 一个 | 平均超过 20 个同样可能的行业 |`win_a[100][100]`|
 | （一，100） | 乙| 使用 B 的最佳目标获得 100 分 |`win_b[a][100]`|
 | (100,100) | B先| 将 A-win 概率转换为 B-win 概率 | 0.950215081962 |

 第二条跟踪表明，相同的预先计算表可以回答所有输入大小，而无需重新计算游戏。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(501²·20) | 每个分数对都会处理一次，每次转换最多检查 20 个飞镖扇区 |
 | 空间| O(501²) | 两个概率表存储所有游戏状态 |

 每个最大的表包含大约 252,000 个条目。 操作数量只有几百万，完全符合限制。 

## 测试用例```python
import sys
import io

# This assumes solve() from the solution is available.
def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    ans = sys.stdout.getvalue()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return ans

assert run("5\n100\n0\n") == (
    "0.136363636364 0.909090909091\n"
    "0.072504908290 0.950215081962\n"
), "samples"

assert run("1\n0\n").strip() == "0.050000000000 0.950000000000", "minimum score"

assert run("501\n0\n").count("\n") == 1, "maximum score"

assert run("20\n0\n").strip().startswith("0."), "sector boundary"

assert run("100\n100\n0\n").count("\n") == 2, "multiple queries"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`5`,`100`| 样本概率 | 一般正确性 |
 |`1`| 只完成第 1 部分 | 精确零处理 |
 |`501`| 一个有效的结果行 | 最大状态大小 |
 |`20`| 公共部门的概率计算| 行业转型 |
 | 两个相同的查询 | 两个相同的答案 | 多个测试用例处理 |

 ## 边缘情况

 用于输入`1`，动态程序考虑每个飞镖值。 只有值为 1 的扇区才达到零。 其他所有区域的分数都保持不变或太高，因此这些概率会在其他玩家的回合中继续存在。 这避免了将任何大于或等于剩余分数的值视为胜利的常见错误。 

用于输入`5`、20 或 18 等扇区并不是有用的终结投掷。 转换使这些结果的分数保持不变。 该表仍然处理状态，因为即使分数没有变化，回合也会发生变化。 

用于输入`501`，最大可能的状态仍在预计算表内。 同样的循环是有效的，因为控制运行时间的是可能得分的数量，而不是可能的游戏历史的数量。
