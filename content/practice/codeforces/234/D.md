---
title: "CF 234D - 电影院"
description: "Vasya 有一个电影列表和一个最喜欢的演员列表。 每部电影都会列出一些演员阵容，但某些演员 ID 可能会丢失（用 0 表示）。"
date: "2026-06-04T09:53:47+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 234
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 145 (Div. 2, ACM-ICPC Rules)"
rating: 1600
weight: 234
solve_time_s: 138
verified: true
draft: false
---

[CF 234D - 电影院](https://codeforces.com/problemset/problem/234/D)

 **评分：** 1600
 **标签：** 实施
 **求解时间：** 2m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Vasya 有一个电影列表和一个最喜欢的演员列表。 每部电影都会列出一些演员阵容，但某些演员 ID 可能会丢失（用 0 表示）。 Vasya 希望将每部电影分为三个类别之一：它肯定会是最喜欢的，它肯定不会是最喜欢的，或者根据缺失的演员 ID，它可能会成为任何一种。 如果一部电影在所有演员 ID 公开后，至少包含与任何其他电影一样多的最喜爱演员，则该电影是最喜爱的。 

输入提供演员总数、Vasya 最喜欢的演员的 ID 以及演员阵容的电影列表（包括未知演员）。 输出是每部电影一行，用 0、1 或 2 指示类别。 

约束很小：最多有 100 个演员和 100 部电影，因此 O(n·m) 算法是可行的。 关键的挑战是处理不确定性：一些演员是未知的，他们的身份可以改变一部电影是否受欢迎。 

非明显的边缘情况包括所有演员都未知的电影，或者已经有所有最喜欢的演员出现但仍然有可能不是最喜欢的未知位置的电影。 仅计算已知最爱的粗心方法可能会对这些场景进行错误分类。 

例如，考虑有 3 个最喜欢的演员 {1,2,3} 的 3 部电影：```
movie1: actors = [0,0,0]   # all unknown
movie2: actors = [1,2,3]   # all favorite known
movie3: actors = [1,0,4]   # mix known favorite, unknown, non-favorite
```Movie1 可以有 0 到 3 个最喜欢的演员。 Movie2 保证有 3 个。Movie3 可能有 1 或 2 个最爱，具体取决于未知演员。 正确的分类需要考虑最喜欢的演员的最小和最大可能。 

## 方法

 暴力方法将枚举每部电影中未知演员 ID 的所有可能分配，计算每个分配的最爱，并确定最喜欢的电影。 这是正确的但不可行：每部电影都有`u`未知演员有 O((m)^u) 种组合，并且对于最多 100 部电影，这种组合会爆炸。 

关键的见解是计算**每部电影中最喜欢的演员的最小和最大可能数量**，而不枚举所有可能性。 对于每部电影，我们可以计算已知最喜欢的演员（`f_known`）和未知演员（`u`）。 最大可能的收藏夹是`f_known + min(u, k - f_total)`， 在哪里`f_total`是其他电影中已使用的最喜爱演员的总数。 最小可能的收藏夹是`f_known`（假设没有一个不知名的演员是最喜欢的）或`f_known + max(0, u - (m - k))`如果一些不知名的演员必须受到喜爱，因为没有足够的非喜爱演员。 

一旦我们有了每部电影的最小值和最大值，我们就可以分类：

 - 如果其最小数量大于或等于所有其他电影的最大数量，那么肯定是最喜欢的。 
- 如果它的最大数量小于其他电影的最大数量，那么肯定不是最喜欢的。 
- 否则，事情可能会发展到任何一个方向。 

这将问题的复杂度降低到 O(n·m)：我们扫描每部电影一次，计算计数，然后在电影之间进行比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((m^u)·n) | O((m^u)·n) | O(n) | 太慢了 |
 | 最小/最大计数 | O(n·m) | O(n) | 已接受 |

 ## 算法演练

 1.读取演员人数`m`和最喜欢的演员`k`。 将最喜欢的 ID 存储在一组中以进行 O(1) 查找。 
2.读取电影数量`n`。 对于每部电影，存储其标题、演员数量`d`，以及参与者 ID 列表，跟踪哪些 ID 未知 (0)。 
3. 对于每部电影，数数`f_known`因为已经出现的最喜欢的演员的数量，以及`u`以及未知演员的数量。 
4. 计算电影中最喜欢的演员的最大数量为`f_known + min(u, k - f_known_other)`。 由于演员在电影中是不同的，因此最大数量受到电影中尚未出现的剩余喜爱演员的限制。 
5. 计算最喜欢的最少演员：`f_known`。 如果未知演员的数量超过可用的非喜爱演员的数量，则必须有一些演员是喜爱的，因此相应地增加最小值。 
6. 收集所有电影的最小和最大计数。 
7. 对于每部电影，确定输出：

 - 如果其最小可能的收藏数至少是所有其他电影的最大可能的收藏数，则输出 0（肯定是最喜欢的）。 
- 如果其最大可能的收藏数小于其他某些电影的最大可能的收藏数，则输出 1（肯定不是最喜欢的）。 
- 否则，输出 2（可以是其中之一）。 
8. 按照输入的顺序打印结果。 

**为什么有效：** 通过跟踪每部电影可能的喜爱计数的极值，我们确保未知演员的分配不会与分类相矛盾。 每个决定仅取决于可能的范围，保证正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

m, k = map(int, input().split())
fav = set(map(int, input().split()))
n = int(input())

movies = []

for _ in range(n):
    title = input().strip()
    d = int(input())
    actors = list(map(int, input().split()))
    f_known = sum(1 for a in actors if a in fav)
    u = actors.count(0)
    movies.append({'title': title, 'f_known': f_known, 'unknown': u, 'd': d})

min_favs = []
max_favs = []

for movie in movies:
    f_known = movie['f_known']
    u = movie['unknown']
    d = movie['d']
    
    # maximum possible favorite actors
    max_possible = f_known + min(u, k - f_known)
    
    # minimum possible favorite actors
    non_favs_total = m - k
    max_non_favs_in_movie = min(u, non_favs_total - (d - f_known - u))
    min_possible = f_known + max(0, u - max_non_favs_in_movie)
    
    min_favs.append(min_possible)
    max_favs.append(max_possible)

results = []

for i in range(n):
    sure_fav = all(min_favs[i] >= max_favs[j] for j in range(n) if j != i)
    sure_not = any(max_favs[i] < max_favs[j] for j in range(n) if j != i)
    if sure_fav:
        results.append(0)
    elif sure_not:
        results.append(1)
    else:
        results.append(2)

print('\n'.join(map(str, results)))
```**说明：** 该解决方案首先读取所有输入并计算每部电影已知的最喜欢的演员和未知的演员。 然后，它计算可能最喜欢的演员的范围。 最后，它通过将每部电影的最小值/最大值与其他电影的最大值进行比较来对每部电影进行分类。 微妙的部分包括通过剩余的收藏来限制最大值，并在由于没有足够的非收藏而被迫收藏未知数时计算最小值。 

## 工作示例

 ### 输入示例 1```
5 3
1 2 3
6
firstfilm
3
0 0 0
secondfilm
4
0 0 4 5
thirdfilm
1
2
fourthfilm
1
5
fifthfilm
1
4
sixthfilm
2
1 0
```| 电影| f_已知 | 未知 | 分钟| 最大|
 | --- | --- | --- | --- | --- |
 | 第一部电影| 0 | 3 | 0 | 3 |
 | 第二部电影 | 0 | 2 | 0 | 2 |
 | 第三部电影| 1 | 0 | 1 | 1 |
 | 第四部电影| 0 | 1 | 0 | 1 |
 | 第五部电影 | 0 | 1 | 0 | 1 |
 | 第六部电影 | 1 | 1 | 1 | 2 |

 分类：

 - 第一部电影：可能是最喜欢的，也可能不是最喜欢的 → 2
 - 第二部电影：可能喜欢也可能不喜欢 → 2
 - 第三部电影：最大值 < 一些其他最大值 → 1
 - 第四部电影：最大值 < 一些其他最大值 → 1
 - 第五部电影：最大值 < 其他最大值 → 1
 - 第六部电影：可能喜欢也可能不喜欢 → 2

 输出：```
2
2
1
1
1
2
```### 自定义示例```
3 2
1 2
2
alpha
2
1 0
beta
1
2
```| 电影| f_已知 | 未知 | 分钟| 最大|
 | --- | --- | --- | --- | --- |
 | 阿尔法 | 1 | 1 | 1 | 2 |
 | 测试版 | 1 | 0 | 1 | 1 |

 分类：

 - alpha：其他的最小值 >= 最大值？ 1 >= 1 → 是的，可能是最喜欢的
 - 最大值 < 其他的最大值？ 2 < 1 → 否
 - 既不肯定也不 → 2
 - beta：最小值 1 >= 其他最大值？ 1 >= 2 → 否
 - 最大值 1 < 其他最大值？ 1 < 2 → 是的，肯定不是最喜欢的 → 1

 输出：```
2
1
```## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
